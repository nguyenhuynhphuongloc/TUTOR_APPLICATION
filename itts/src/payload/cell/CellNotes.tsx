/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use server";

import { format } from "date-fns";
import type { DefaultServerCellComponentProps } from "payload";

const CellNotes: React.FC<DefaultServerCellComponentProps> = async (req) => {
  const { cellData, payload } = req;
  if (cellData && cellData.length === 0) {
    return "";
  }

  const ids = cellData.map(({ createdBy }) => createdBy);

  const { docs } = await payload.find({
    collection: "admins",
    where: {
      id: { in: ids },
    },
    limit: 1000,
    select: { fullName: true },
  });

  const users = docs.reduce(
    (acc, user) => {
      acc[user.id] = user.fullName;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div style={{ width: 300 }}>
      {cellData.map((note) => {
        return (
          <div key={note.id}>
            <div>
              [{format(note.createdAt, "dd/MM/yyyy")}]{" "}
              <b>{users[note.createdBy]}</b> : {note.message}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CellNotes;
