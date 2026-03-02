import type { Lead, Order, User } from "@/payload-types";
import type {
  CollectionAfterChangeHook,
  PayloadRequest,
  RequestContext,
} from "payload";

const DEFAULT_PASSWORD = "123456";

/**
 * After change hook for the "leads" collection.
 *
 * If the lead's status has been updated to "paid_case", create a new user with
 * the same phone number and create an order with the associated coupon and
 * courses.
 */
const afterChangeLeads: CollectionAfterChangeHook<Lead> = async ({
  req,
  doc,
  context: { coupon, courses },
  previousDoc,
  operation,
}: {
  req: PayloadRequest;
  doc: Lead;
  previousDoc: Lead;
  context: RequestContext;
  operation: string;
}): Promise<void> => {
  // ensure that the lead that already been paid case can not create another user
  if (
    operation === "update" &&
    previousDoc.status === "paid_case" &&
    doc.status === previousDoc.status
  ) {
    return;
  }

  if (doc.status === "paid_case") {
    const { payload } = req;
    try {
      const { phone, id } = doc;

      const user = await payload.create({
        req,
        collection: "users",
        data: {
          password: DEFAULT_PASSWORD,
          username: phone,
          lead: id,
        } as unknown as User,
      });

      await payload.create({
        req,
        collection: "orders",
        data: {
          coupon: coupon,
          customer: user.id,
          courses,
        } as unknown as Order,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
};

export default afterChangeLeads;
