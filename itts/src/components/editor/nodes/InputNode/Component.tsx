import { NodeKey } from "lexical";
import { useSharedContext } from "../../context/SharedContext";

import AdminComponent from "./AdminComponent";
import ClientComponent from "./ClientComponent";

export default function Component(props: {
  nodeKey: NodeKey;
  uuid: string;
  answer: string;
  answerLocation?: string;
  explanation?: string;
  questionTitle?: string;
  locateTime?: string;
}) {
  const mode = useSharedContext((state) => state.mode);

  if (mode === "in_admin") {
    return <AdminComponent {...props} />;
  }

  if (
    mode === "practice" ||
    mode === "view_result" ||
    mode === "read_only" ||
    mode === "view"
  ) {
    return (
      <ClientComponent
        {...props}
        readOnly={["view_result", "read_only", "view"].includes(mode)}
      />
    );
  }

  return null;
}
