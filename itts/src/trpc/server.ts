import "server-only";

import { cache } from "react";
import { createQueryClient } from "./query-client";

const getQueryClient = cache(createQueryClient);

export { getQueryClient };
