/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./ContentEditable.css";

import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import type { JSX } from "react";

type Props = {
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
};

export default function ContentEditable({
  className,
  placeholder,
  placeholderClassName,
}: Props): JSX.Element {
  return (
    <LexicalContentEditable
      className={className ?? "ContentEditable__root"}
      aria-placeholder={placeholder}
      placeholder={
        <div className={placeholderClassName ?? "ContentEditable__placeholder"}>
          {placeholder}
        </div>
      }
    />
  );
}
