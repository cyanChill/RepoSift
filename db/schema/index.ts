import * as nextAuthSchema from "./next-auth";
import * as mainSchema from "./main";

const schema = { ...nextAuthSchema, ...mainSchema };

export default schema;
