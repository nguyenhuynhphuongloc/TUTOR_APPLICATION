import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import * as React from "react";
import { Suspense } from "react";

export type Options = ReadonlyArray<Option>;

export type Option = Readonly<{
  uuid: string;
  answer: string;
}>;

const Component = React.lazy(() => import("./Component"));

const nodeType = "CP1vvky6";

export type SerializedInputNode = Spread<
  {
    uuid: string;
    answer: string;
    answerLocation: string;
    explanation: string;
    questionTitle?: string;
    locateTime?: string;
  },
  SerializedLexicalNode
>;

function $convertInputElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const uuid = domNode.getAttribute(`data-lexical-${nodeType}-uuid`);
  const answer = domNode.getAttribute(`data-lexical-${nodeType}-answer`);
  const answerLocation = domNode.getAttribute(
    `data-lexical-${nodeType}-answer-location`,
  );
  const explanation = domNode.getAttribute(
    `data-lexical-${nodeType}-explanation`,
  );
  const questionTitle = domNode.getAttribute(
    `data-lexical-${nodeType}-questionTitle`,
  );
  const locateTime = domNode.getAttribute(
    `data-lexical-${nodeType}-locateTime`,
  );
  if (uuid !== null) {
    const node = $createInputNode(
      uuid,
      answer ?? "",
      answerLocation ?? "",
      explanation ?? "",
      questionTitle ?? "",
      locateTime ?? "",
    );
    return { node };
  }
  return null;
}

export class InputNode extends DecoratorNode<React.JSX.Element> {
  __uuid: string;
  __answer: string;
  __answerLocation: string;
  __explanation: string;
  __questionTitle?: string;
  __locateTime?: string;

  constructor(
    uuid: string,
    answer: string,
    answerLocation: string,
    explanation: string,
    questionTitle?: string,
    locateTime?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__uuid = uuid;
    this.__answer = answer;
    this.__answerLocation = answerLocation;
    this.__explanation = explanation;
    this.__questionTitle = questionTitle;
    this.__locateTime = locateTime;
  }

  static getType(): string {
    return nodeType;
  }

  static clone(node: InputNode): InputNode {
    return new InputNode(
      node.__uuid,
      node.__answer,
      node.__answerLocation,
      node.__explanation,
      node.__questionTitle,
      node.__locateTime,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedInputNode): InputNode {
    const node = $createInputNode(
      serializedNode.uuid,
      serializedNode.answer,
      serializedNode.answerLocation,
      serializedNode.explanation,
      serializedNode.questionTitle,
      serializedNode.locateTime,
    );
    return node;
  }

  exportJSON(): SerializedInputNode {
    return {
      uuid: this.__uuid,
      answer: this.__answer,
      answerLocation: this.__answerLocation,
      explanation: this.__explanation,
      questionTitle: this.__questionTitle,
      locateTime: this.__locateTime,
      type: nodeType,
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute(`data-lexical-${nodeType}-uuid`)) {
          return null;
        }
        return {
          conversion: $convertInputElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute(`data-lexical-${nodeType}-uuid`, this.__uuid);
    element.setAttribute(`data-lexical-${nodeType}-answer`, this.__answer);
    element.setAttribute(
      `data-lexical-${nodeType}-answer-location`,
      this.__answerLocation,
    );
    element.setAttribute(
      `data-lexical-${nodeType}-explanation`,
      this.__explanation,
    );
    element.setAttribute(
      `data-lexical-${nodeType}-questionTitle`,
      this.__questionTitle || "",
    );
    element.setAttribute(
      `data-lexical-${nodeType}-locateTime`,
      this.__locateTime || "",
    );
    return { element };
  }

  createDOM(): HTMLElement {
    const elem = document.createElement("span");
    elem.style.display = "inline-block";
    elem.style.verticalAlign = "middle";
    return elem;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.JSX.Element {
    return (
      <Suspense fallback={null}>
        <Component
          nodeKey={this.__key}
          uuid={this.__uuid}
          answer={this.__answer}
          answerLocation={this.__answerLocation}
          explanation={this.__explanation}
          questionTitle={this.__questionTitle}
          locateTime={this.__locateTime}
        />
      </Suspense>
    );
  }

  setValues(values: {
    answer: string;
    answerLocation?: string;
    explanation?: string;
    questionTitle?: string;
    locateTime?: string;
  }): void {
    const self = this.getWritable();
    self.__answer = values.answer;
    self.__answerLocation = values.answerLocation ?? "";
    self.__explanation = values.explanation ?? "";
    self.__questionTitle = values.questionTitle ?? "";
    self.__locateTime = values.locateTime ?? "";
  }
}

export function $createInputNode(
  uuid: string,
  answer: string = "",
  answerLocation: string = "",
  explanation: string = "",
  locateTime?: string,
  questionTitle?: string,
): InputNode {
  return new InputNode(
    uuid,
    answer,
    answerLocation,
    explanation,
    questionTitle,
    locateTime,
  );
}

export function $isInputNode(
  node: LexicalNode | null | undefined,
): node is InputNode {
  return node instanceof InputNode;
}
