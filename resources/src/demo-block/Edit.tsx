import { warnings, type Data } from "./data";
import View from "./View";

export type EditProps = {
  data?: Data;
};

export function Edit(props: EditProps) {
  const data = props.data ?? {};
  const notes = warnings(data);
  return (
    <>
      <View {...props} isEditMode />
      {notes.map((note) => (
        <p key={note} className="demo-block-notice" contentEditable={false}>
          {note}
        </p>
      ))}
    </>
  );
}

export default Edit;
