/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { getTranslation } from "@payloadcms/translations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatFilesize } from "payload/shared";
import { useEffect, useState } from "react";

// Import components

// Import providers and hooks

import {
  Button,
  Gutter,
  ListControls,
  ListHeader,
  RelationshipProvider,
  RenderCustomComponent,
  SelectionProvider,
  SelectMany,
  TableColumnsProvider,
  useAuth,
  useBulkUpload,
  useConfig,
  useEditDepth,
  useListDrawerContext,
  useModal,
  useStepNav,
  useTranslation,
  useWindowInfo,
  ViewDescription,
} from "@payloadcms/ui";

const baseClass = "collection-list";

export const DefaultListView = ({
  AfterList,
  AfterListTable,
  beforeActions,
  BeforeList,
  BeforeListTable,
  collectionSlug,
  columnState,
  Description,
  disableBulkDelete,
  disableBulkEdit,
  enableRowSelections,
  hasCreatePermission,
  listPreferences,
  newDocumentURL,
  preferenceKey,
  renderedFilters,
  Table: InitialTable,
  data,
}) => {
  const [Table, setTable] = useState(InitialTable);
  const {
    createNewDrawerSlug,
    drawerSlug: listDrawerSlug,
    onBulkSelect,
  } = useListDrawerContext();
  const { user } = useAuth();
  const { getEntityConfig } = useConfig();
  const router = useRouter();
  // const {
  //   defaultLimit: initialLimit,
  //   handlePageChange,
  //   handlePerPageChange,
  //   query,
  //   data,
  // } = useListQuery();
  const { openModal } = useModal();
  const { setCollectionSlug, setOnSuccess } = useBulkUpload();
  const { drawerSlug: bulkUploadDrawerSlug } = useBulkUpload();
  const { i18n, t } = useTranslation();
  const drawerDepth = useEditDepth();
  const { setStepNav } = useStepNav();
  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo();

  const collectionConfig = getEntityConfig({ collectionSlug });
  const { labels, upload } = collectionConfig;
  const isUploadCollection = Boolean(upload);
  const isBulkUploadEnabled =
    isUploadCollection && collectionConfig.upload.bulkUpload;
  const isInDrawer = Boolean(listDrawerSlug);

  // Update Table when InitialTable changes
  useEffect(() => {
    if (InitialTable) {
      setTable(InitialTable);
    }
  }, [InitialTable]);

  // Format docs if it's an upload collection
  const docs = isUploadCollection
    ? data.docs.map((doc) => ({
        ...doc,
        filesize: formatFilesize(doc.filesize),
      }))
    : data?.docs;

  const openBulkUpload = () => {
    setCollectionSlug(collectionSlug);
    openModal(bulkUploadDrawerSlug);
    setOnSuccess(() => router.refresh());
  };

  // Set step navigation
  useEffect(() => {
    if (drawerDepth <= 1) {
      setStepNav([
        {
          label: labels?.plural,
        },
      ]);
    }
  }, [setStepNav, labels, drawerDepth]);

  // Prepare actions including SelectMany if enabled
  const actions =
    enableRowSelections && typeof onBulkSelect === "function"
      ? beforeActions
        ? [
            ...beforeActions,
            <SelectMany key="select-many" onClick={onBulkSelect} />,
          ]
        : [<SelectMany key="select-many" onClick={onBulkSelect} />]
      : beforeActions;

  return (
    <TableColumnsProvider
      collectionSlug={collectionSlug}
      columnState={columnState}
      docs={docs}
      enableRowSelections={enableRowSelections}
      listPreferences={listPreferences}
      preferenceKey={preferenceKey}
      setTable={setTable}
    >
      <div className={`${baseClass} ${baseClass}--${collectionSlug}`}>
        <SelectionProvider docs={docs} totalDocs={data?.totalDocs} user={user}>
          {BeforeList}
          <Gutter className={`${baseClass}__wrap`}>
            <ListHeader
              collectionConfig={collectionConfig}
              Description={
                <div className={`${baseClass}__sub-header`}>
                  <RenderCustomComponent
                    CustomComponent={Description}
                    Fallback={
                      <ViewDescription
                        description={collectionConfig?.admin?.description}
                      />
                    }
                  />
                </div>
              }
              hasCreatePermission={hasCreatePermission}
              i18n={i18n}
              isBulkUploadEnabled={isBulkUploadEnabled}
              newDocumentURL={newDocumentURL}
              openBulkUpload={openBulkUpload}
              smallBreak={smallBreak}
              t={t}
            />

            <ListControls
              beforeActions={actions}
              collectionConfig={collectionConfig}
              collectionSlug={collectionSlug}
              disableBulkDelete={disableBulkDelete}
              disableBulkEdit={disableBulkEdit}
              renderedFilters={renderedFilters}
            />

            {BeforeListTable}

            {docs?.length > 0 && (
              <RelationshipProvider>{Table}</RelationshipProvider>
            )}

            {docs?.length === 0 && (
              <div className={`${baseClass}__no-results`}>
                <p>
                  {i18n.t("general:noResults", {
                    label: getTranslation(labels?.plural, i18n),
                  })}
                </p>
                {hasCreatePermission &&
                  newDocumentURL &&
                  (isInDrawer ? (
                    <Button
                      el="button"
                      onClick={() => openModal(createNewDrawerSlug)}
                    >
                      {i18n.t("general:createNewLabel", {
                        label: getTranslation(labels?.singular, i18n),
                      })}
                    </Button>
                  ) : (
                    <Button el="link" Link={Link} to={newDocumentURL}>
                      {i18n.t("general:createNewLabel", {
                        label: getTranslation(labels?.singular, i18n),
                      })}
                    </Button>
                  ))}
              </div>
            )}

            {AfterListTable}

            {/* {docs?.length > 0 && (
              <div className={`${baseClass}__page-controls`}>
                <Pagination
                  hasNextPage={data.hasNextPage}
                  hasPrevPage={data.hasPrevPage}
                  limit={data.limit}
                  nextPage={data.nextPage}
                  numberOfNeighbors={1}
                  onChange={(page) => handlePageChange(page)}
                  page={data.page}
                  prevPage={data.prevPage}
                  totalPages={data.totalPages}
                />

                {data?.totalDocs > 0 && (
                  <>
                    <div className={`${baseClass}__page-info`}>
                      {data?.page * data.limit - (data.limit - 1)}-
                      {data.totalPages > 1 && data.totalPages !== data.page
                        ? data.limit * data.page
                        : data.totalDocs}{" "}
                      {i18n.t("general:of")} {data.totalDocs}
                    </div>

                    <PerPage
                      handleChange={(limit) => handlePerPageChange(limit)}
                      limit={
                        isNumber(query?.limit)
                          ? Number(query.limit)
                          : initialLimit
                      }
                      limits={collectionConfig?.admin?.pagination?.limits}
                      resetPage={data.totalDocs <= data.pagingCounter}
                    />

                    {smallBreak && (
                      <div className={`${baseClass}__list-selection`}>
                        <ListSelection
                          label={getTranslation(
                            collectionConfig.labels.plural,
                            i18n,
                          )}
                        />
                        <div className={`${baseClass}__list-selection-actions`}>
                          {actions}
                          {!disableBulkEdit && (
                            <>
                              <EditMany collection={collectionConfig} />
                              <PublishMany collection={collectionConfig} />
                              <UnpublishMany collection={collectionConfig} />
                            </>
                          )}
                          {!disableBulkDelete && (
                            <DeleteMany collection={collectionConfig} />
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )} */}
          </Gutter>
          {AfterList}
        </SelectionProvider>
      </div>
    </TableColumnsProvider>
  );
};
