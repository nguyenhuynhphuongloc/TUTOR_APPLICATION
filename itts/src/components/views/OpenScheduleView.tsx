// "use client";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AdminViewProps } from "payload";

import { buildTableState } from "@payloadcms/ui/utilities/buildTableState";
import React from "react";
import { DefaultListView } from "../list/DefaultListView";

const columns = [
  {
    accessor: "name",
    active: true,
  },
  {
    accessor: "startDate",
    active: true,
  },
];

// chuyen qua use server
//dung buildtablestate
// tim` collection config cua classes va hoc vien sau do cho vào build table state

export const OpenScheduleView: React.FC<AdminViewProps> = async ({
  ...req
}) => {
  // const [classes, setClasses] = useState();
  // const [tableColumns, setTableColumns] = React.useState(columns);
  // const [table, setTable] = React.useState();
  // const { getTableState } = useServerFunctions();

  // useEffect(() => {
  //   const fetchOptions = async (): Promise<void> => {
  //     try {
  //       const result = await fetch("/api/classes?depth=1").then((res) =>
  //         res.json(),
  //       );

  //       setClasses(result);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchOptions();
  // }, []);
  // useEffect(() => {
  //   const render = async () => {
  //     const result = await getTableState({
  //       collectionSlug: "classes",
  //       columns,
  //       docs: classes.docs,
  //       enableRowSelections: false,
  //       renderRowTypes: false,
  //       tableAppearance: "condensed",
  //     });
  //     setTable(result.Table);
  //     setTableColumns(result.state);
  //   };
  //   if (classes) render();
  // }, [classes]);

  // const { getEntityConfig } = useConfig();
  // const config = getEntityConfig({ collectionSlug: "classes" });
  // let fields = flattenTopLevelFields(config.fields);

  const tableData = await req.payload.find({
    collection: "classes",
    page: 1,
    limit: 100,
    depth: 1,
  });
  const { renderedFilters, Table, state, preferences, data } =
    await buildTableState({
      collectionSlug: "classes",
      columns,
      docs: tableData.docs,
      enableRowSelections: false,
      renderRowTypes: false,
      req,
      tableAppearance: "default",
    });
  // if (!classes) return <div>hihi</div>;

  // const r = buildTableState()

  const props = {
    collectionSlug: "classes",
    columnState: state,
    Table,
    enableRowSelections: false,
    hasCreatePermission: false,
    newDocumentURL: "",
    renderedFilters,
    data,
  };

  return <DefaultListView {...props} />;
};
