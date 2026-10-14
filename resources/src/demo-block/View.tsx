import { text, type Data } from "./data";

export type ViewProps = {
  data?: Data;
  isEditMode?: boolean;
};

export function View({ data = {}, isEditMode }: ViewProps) {
  const title = text(data.title);
  const description = text(data.description);

  const copy = title || description;

  const node = (
    <div className={`demo-block`}>
      {copy ? (
        <div className="demo-block-copy">
          {title ? <h2 className="demo-block-title">{title}</h2> : null}
          {description ? <p className="demo-block-description">{description}</p> : null}
        </div>
      ) : null}
    </div>
  );

  return node;
}

export default View;
