import {
  NodeHandler,
  NodeHandlers,
  TipTapRender,
} from "@troop.com/tiptap-react-render";

const doc: NodeHandler = (props) => <>{props.children}</>;

const paragraph: NodeHandler = (props) => {
  return <p>{props.children}</p>;
};

const text: NodeHandler = (props) => {
  return <span>{props.node.text}</span>;
};

const img: NodeHandler = (props) => {
  const { src, alt, title } = props.node;
  return <img src={src} alt={alt} title={title} />;
};

const handlers: NodeHandlers = {
  doc: doc,
  text: text,
  paragraph: paragraph,
  img: img,
};

interface BlobContentRenderProps {
  data: any;
}

export function BlobContentRender(props: BlobContentRenderProps) {
  const { data } = props;
  return (
    <div className="p-2">
      <TipTapRender handlers={handlers} node={data} />
    </div>
  );
}
