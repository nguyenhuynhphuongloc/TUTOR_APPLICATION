"use client";

import { RelationshipInput, useField } from "@payloadcms/ui";
import type { RelationshipFieldClientComponent } from "payload";
import { useCallback, useMemo } from "react";

const CustomRelationshipSingle: RelationshipFieldClientComponent = (props) => {
  // Safely extract field values; default to empty objects if undefined
  const {
    field,
    path: pathFromProps,
    readOnly = false,
    validate,
    relationTo: relationToPropFromProps,
    label: labelFromProps = "",
    required: requiredFromProps = false,
    value: valueFromProps,
    onChange: onChangeFromProps,
  } = props;

  const {
    admin: {
      allowCreate = true,
      allowEdit = true,
      appearance = "select",
      description,
      placeholder,
    } = {},
    label: labelFromField,
    relationTo: relationToPropFromField,
    required: requiredFromField,
  } = field || {};

  // Decide final props: field takes precedence if exists
  const relationToProp = relationToPropFromField || relationToPropFromProps;
  
  const label = labelFromField ?? labelFromProps;

  const required = requiredFromField ?? requiredFromProps;

  /** ---------------------------
   * VALIDATION
   * --------------------------- */
  const memoValidate = useCallback(
    (value, opts) => {
      if (typeof validate === "function") {
        return validate(value, { ...opts, required });
      }
    },
    [validate, required],
  );

  /** ---------------------------
   * FIELD STATE
   * --------------------------- */
  const { value, setValue, initialValue, filterOptions, disabled, showError, path } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoValidate,
    value: valueFromProps, // allow passing value directly
    onChange: onChangeFromProps, // allow passing onChange directly
  });

  /** ---------------------------
   * RELATION TO (single only)
   * --------------------------- */
  const relationTo = useMemo(() => (Array.isArray(relationToProp) ? relationToProp : [relationToProp]), [relationToProp]);
  const isPolymorphic = Array.isArray(relationToProp);

  /** ---------------------------
   * FORMAT VALUE FOR RelationshipInput
   * --------------------------- */
  const formattedValue = useMemo(() => {
    if (!value) return null;
    return isPolymorphic ? value : { relationTo: relationTo[0], value };
  }, [value, isPolymorphic, relationTo]);

  const formattedInitialValue = useMemo(() => {
    if (!initialValue) return null;
    return isPolymorphic ? initialValue : { relationTo: relationTo[0], value: initialValue };
  }, [initialValue, isPolymorphic, relationTo]);

  /** ---------------------------
   * HANDLE CHANGE (Single)
   * --------------------------- */
  const handleChange = useCallback(
    (newValue) => {
      if (!newValue) {
        setValue(null);
        return;
      }

      if (isPolymorphic) {
        setValue(newValue);
      } else {
        setValue(newValue.value);
      }
    },
    [setValue, isPolymorphic],
  );

  /** ---------------------------
   * RENDER
   * --------------------------- */
  return (
    <RelationshipInput
      path={path}
      relationTo={relationTo}
      hasMany={false}
      label={label}
      required={required}
      readOnly={readOnly || disabled}
      appearance={appearance}
      placeholder={placeholder}
      description={description}
      filterOptions={filterOptions}
      showError={showError}
      allowCreate={allowCreate}
      allowEdit={allowEdit}
      value={formattedValue}
      initialValue={formattedInitialValue}
      onChange={handleChange}
      maxResultsPerRequest={15}
      formatDisplayedOptions={(options) =>
        options.map((opt) => ({
          ...opt,
          label: `${opt.label}`,
        }))
      }
    />
  );
};

export default CustomRelationshipSingle;
