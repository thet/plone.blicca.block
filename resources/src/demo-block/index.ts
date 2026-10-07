import Edit from "./Edit";
import Icon from "./Icon";
import View from "./View";
import Schema, { BLOCK_TYPE } from "./schema";
import "./styles.css";

export const BlockInfo = {
  id: BLOCK_TYPE,
  title: "Demo Block",
  edit: Edit,
  view: View,
  blockSchema: Schema,
  icon: Icon,
  category: "demo",
};

export { BLOCK_TYPE, Edit, Icon, Schema, View };
