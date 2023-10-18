/**
 * Type definitions adapted from @types/pdf-parse and pdfjs-dist
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pdf-parse/index.d.ts
 * https://github.com/mozilla/pdfjs-dist/blob/master/types/src/display/api.d.ts
 */
declare module 'pdf-parse' {
  export = PdfParse;

  declare function PdfParse(
    dataBuffer: Buffer,
    options?: PdfParse.Options
  ): Promise<PdfParse.Result>;

  declare namespace PdfParse {
    type Version =
      | 'default'
      | 'v1.9.426'
      | 'v1.10.100'
      | 'v1.10.88'
      | 'v2.0.550';
    interface Result {
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      version: Version;
      text: string;
    }
    interface Options {
      pagerender?: ((pageData: PDFPageProxy) => Promise<string>) | undefined;
      max?: number | undefined;
      version?: Version | undefined;
    }
  }

  export type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array;
  export type BinaryData = TypedArray | ArrayBuffer | Array<number> | string;
  export type RefProxy = {
    num: number;
    gen: number;
  };

  /**
   * A PDF document and page is built of many objects. E.g. there are objects for
   * fonts, images, rendering code, etc. These objects may get processed inside of
   * a worker. This class implements some basic methods to manage these objects.
   */
  declare class PDFObjects {
    /**
     * If called *without* callback, this returns the data of `objId` but the
     * object needs to be resolved. If it isn't, this method throws.
     *
     * If called *with* a callback, the callback is called with the data of the
     * object once the object is resolved. That means, if you call this method
     * and the object is already resolved, the callback gets called right away.
     *
     * @param {string} objId
     * @param {function} [callback]
     * @returns {any}
     */
    get(objId: string, callback?: () => void | undefined): any;
    /**
     * @param {string} objId
     * @returns {boolean}
     */
    has(objId: string): boolean;
    /**
     * Resolves the object `objId` with optional `data`.
     *
     * @param {string} objId
     * @param {any} [data]
     */
    resolve(objId: string, data?: any): void;
    clear(): void;
    #private;
  }

  /**
   * Page getViewport parameters.
   */
  export type GetViewportParameters = {
    /**
     * - The desired scale of the viewport.
     */
    scale: number;
    /**
     * - The desired rotation, in degrees, of
     * the viewport. If omitted it defaults to the page rotation.
     */
    rotation?: number | undefined;
    /**
     * - The horizontal, i.e. x-axis, offset.
     * The default value is `0`.
     */
    offsetX?: number | undefined;
    /**
     * - The vertical, i.e. y-axis, offset.
     * The default value is `0`.
     */
    offsetY?: number | undefined;
    /**
     * - If true, the y-axis will not be
     * flipped. The default value is `false`.
     */
    dontFlip?: boolean | undefined;
  };

  /**
   * Page getTextContent parameters.
   */
  export type getTextContentParameters = {
    /**
     * - Replaces all occurrences of whitespace with standard
     * spaces (0x20). The default value is `false`.
     */
    normalizeWhitespace: boolean;
    /**
     * - Do not attempt to combine
     * same line {@link TextItem }'s. The default value is `false`.
     */
    disableCombineTextItems: boolean;
    /**
     * - When true include marked
     * content items in the items array of TextContent. The default is `false`.
     */
    includeMarkedContent?: boolean | undefined;
  };

  /**
   * Page text content.
   */
  export type TextContent = {
    /**
     * - Array of
     * {@link TextItem } and {@link TextMarkedContent } objects. TextMarkedContent
     * items are included when includeMarkedContent is true.
     */
    items: Array<TextItem | TextMarkedContent>;
    /**
     * - {@link TextStyle } objects,
     * indexed by font name.
     */
    styles: {
      [x: string]: TextStyle;
    };
  };

  /**
   * Page text content part.
   */
  export type TextItem = {
    /**
     * - Text content.
     */
    str: string;
    /**
     * - Text direction: 'ttb', 'ltr' or 'rtl'.
     */
    dir: string;
    /**
     * - Transformation matrix.
     */
    transform: Array<any>;
    /**
     * - Width in device space.
     */
    width: number;
    /**
     * - Height in device space.
     */
    height: number;
    /**
     * - Font name used by PDF.js for converted font.
     */
    fontName: string;
    /**
     * - Indicating if the text content is followed by a
     * line-break.
     */
    hasEOL: boolean;
  };

  /**
   * Page text marked content part.
   */
  export type TextMarkedContent = {
    /**
     * - Either 'beginMarkedContent',
     * 'beginMarkedContentProps', or 'endMarkedContent'.
     */
    type: string;
    /**
     * - The marked content identifier. Only used for type
     * 'beginMarkedContentProps'.
     */
    id: string;
  };

  /**
   * Text style.
   */
  export type TextStyle = {
    /**
     * - Font ascent.
     */
    ascent: number;
    /**
     * - Font descent.
     */
    descent: number;
    /**
     * - Whether or not the text is in vertical mode.
     */
    vertical: boolean;
    /**
     * - The possible font family.
     */
    fontFamily: string;
  };

  /**
   * Page render parameters.
   */
  export type RenderParameters = {
    /**
     * - A 2D context of a DOM Canvas object.
     */
    canvasContext: unknown;
    /**
     * - Rendering viewport obtained by calling
     * the `PDFPageProxy.getViewport` method.
     */
    viewport: PageViewport;
    /**
     * - Rendering intent, can be 'display', 'print',
     * or 'any'. The default value is 'display'.
     */
    intent?: string | undefined;
    /**
     * Controls which annotations are rendered
     * onto the canvas, for annotations with appearance-data; the values from
     * {@link AnnotationMode } should be used. The following values are supported:
     * - `AnnotationMode.DISABLE`, which disables all annotations.
     * - `AnnotationMode.ENABLE`, which includes all possible annotations (thus
     * it also depends on the `intent`-option, see above).
     * - `AnnotationMode.ENABLE_FORMS`, which excludes annotations that contain
     * interactive form elements (those will be rendered in the display layer).
     * - `AnnotationMode.ENABLE_STORAGE`, which includes all possible annotations
     * (as above) but where interactive form elements are updated with data
     * from the {@link AnnotationStorage }-instance; useful e.g. for printing.
     * The default value is `AnnotationMode.ENABLE`.
     */
    annotationMode?: number | undefined;
    /**
     * - Additional transform, applied just
     * before viewport transform.
     */
    transform?: any[] | undefined;
    /**
     * - The factory instance that will be used
     * when creating canvases. The default value is {new DOMCanvasFactory()}.
     */
    canvasFactory?: unknown | undefined;
    /**
     * - Background to use for the canvas.
     * Any valid `canvas.fillStyle` can be used: a `DOMString` parsed as CSS
     * <color> value, a `CanvasGradient` object (a linear or radial gradient) or
     * a `CanvasPattern` object (a repetitive image). The default value is
     * 'rgb(255,255,255)'.
     *
     * NOTE: This option may be partially, or completely, ignored when the
     * `pageColors`-option is used.
     */
    background?: string | unknown | undefined;
    /**
     * - Overwrites background and foreground colors
     * with user defined ones in order to improve readability in high contrast
     * mode.
     */
    pageColors?: unknown | undefined;
    /**
     * -
     * A promise that should resolve with an {@link OptionalContentConfig }created from `PDFDocumentProxy.getOptionalContentConfig`. If `null`,
     * the configuration will be fetched automatically with the default visibility
     * states set.
     */
    optionalContentConfigPromise?: Promise<OptionalContentConfig> | undefined;
    /**
     * - Map some
     * annotation ids with canvases used to render them.
     */
    annotationCanvasMap?: Map<string, HTMLCanvasElement> | undefined;
    printAnnotationStorage?: PrintAnnotationStorage | undefined;
  };

  /**
   * Page annotation parameters.
   */
  export type GetAnnotationsParameters = {
    /**
     * - Determines the annotations that are fetched,
     * can be 'display' (viewable annotations), 'print' (printable annotations),
     * or 'any' (all annotations). The default value is 'display'.
     */
    intent?: string | undefined;
  };

  /**
   * Allows controlling of the rendering tasks.
   */
  export class RenderTask {
    constructor(internalRenderTask: any);
    /**
     * Callback for incremental rendering -- a function that will be called
     * each time the rendering is paused.  To continue rendering call the
     * function that is the first argument to the callback.
     * @type {function}
     */
    onContinue: () => void;
    /**
     * Promise for rendering task completion.
     * @type {Promise<void>}
     */
    get promise(): Promise<void>;
    /**
     * Cancels the rendering task. If the task is currently rendering it will
     * not be cancelled until graphics pauses with a timeout. The promise that
     * this object extends will be rejected when cancelled.
     *
     * @param {number} [extraDelay]
     */
    cancel(extraDelay?: number | undefined): void;
    /**
     * Whether form fields are rendered separately from the main operatorList.
     * @type {boolean}
     */
    get separateAnnots(): boolean;
    #private;
  }

  /**
   * Page getOperatorList parameters.
   */
  export type GetOperatorListParameters = {
    /**
     * - Rendering intent, can be 'display', 'print',
     * or 'any'. The default value is 'display'.
     */
    intent?: string | undefined;
    /**
     * Controls which annotations are included
     * in the operatorList, for annotations with appearance-data; the values from
     * {@link AnnotationMode } should be used. The following values are supported:
     * - `AnnotationMode.DISABLE`, which disables all annotations.
     * - `AnnotationMode.ENABLE`, which includes all possible annotations (thus
     * it also depends on the `intent`-option, see above).
     * - `AnnotationMode.ENABLE_FORMS`, which excludes annotations that contain
     * interactive form elements (those will be rendered in the display layer).
     * - `AnnotationMode.ENABLE_STORAGE`, which includes all possible annotations
     * (as above) but where interactive form elements are updated with data
     * from the {@link AnnotationStorage }-instance; useful e.g. for printing.
     * The default value is `AnnotationMode.ENABLE`.
     */
    annotationMode?: number | undefined;
    printAnnotationStorage?: PrintAnnotationStorage | undefined;
  };
  
  /**
   * Structure tree node. The root node will have a role "Root".
   */
  export type StructTreeNode = {
    /**
     * - Array of
     * {@link StructTreeNode } and {@link StructTreeContent } objects.
     */
    children: Array<StructTreeNode | StructTreeContent>;
    /**
     * - element's role, already mapped if a role map exists
     * in the PDF.
     */
    role: string;
  };

  /**
   * Structure tree content.
   */
  export type StructTreeContent = {
    /**
     * - either "content" for page and stream structure
     * elements or "object" for object references.
     */
    type: string;
    /**
     * - unique id that will map to the text layer.
     */
    id: string;
  };

  /**
   * PDF page operator list.
   */
  export type PDFOperatorList = {
    /**
     * - Array containing the operator functions.
     */
    fnArray: Array<number>;
    /**
     * - Array containing the arguments of the
     * functions.
     */
    argsArray: Array<any>;
  };

  /**
   * Proxy to a `PDFPage` in the worker thread.
   */
  export class PDFPageProxy {
    constructor(
      pageIndex: any,
      pageInfo: any,
      transport: any,
      ownerDocument: any,
      pdfBug?: boolean
    );
    _pageIndex: any;
    _pageInfo: any;
    _ownerDocument: any;
    _transport: any;
    _stats: StatTimer | null;
    _pdfBug: boolean;
    /** @type {PDFObjects} */
    commonObjs: PDFObjects;
    objs: PDFObjects;
    _bitmaps: Set<any>;
    cleanupAfterRender: boolean;
    pendingCleanup: boolean;
    _intentStates: Map<any, any>;
    destroyed: boolean;
    /**
     * @type {number} Page number of the page. First page is 1.
     */
    get pageNumber(): number;
    /**
     * @type {number} The number of degrees the page is rotated clockwise.
     */
    get rotate(): number;
    /**
     * @type {RefProxy | null} The reference that points to this page.
     */
    get ref(): RefProxy | null;
    /**
     * @type {number} The default size of units in 1/72nds of an inch.
     */
    get userUnit(): number;
    /**
     * @type {Array<number>} An array of the visible portion of the PDF page in
     *   user space units [x1, y1, x2, y2].
     */
    get view(): number[];
    /**
     * @param {GetViewportParameters} params - Viewport parameters.
     * @returns {PageViewport} Contains 'width' and 'height' properties
     *   along with transforms required for rendering.
     */
    getViewport({
      scale,
      rotation,
      offsetX,
      offsetY,
      dontFlip,
    }?: GetViewportParameters): PageViewport;
    /**
     * @param {GetAnnotationsParameters} params - Annotation parameters.
     * @returns {Promise<Array<any>>} A promise that is resolved with an
     *   {Array} of the annotation objects.
     */
    getAnnotations({ intent }?: GetAnnotationsParameters): Promise<Array<any>>;
    /**
     * @returns {Promise<unknown>} A promise that is resolved with an
     *   {unknown} with JS actions.
     */
    getJSActions(): Promise<unknown>;
    /**
     * @type {boolean} True if only XFA form.
     */
    get isPureXfa(): boolean;
    /**
     * @returns {Promise<unknown | null>} A promise that is resolved with
     *   an {unknown} with a fake DOM object (a tree structure where elements
     *   are {unknown} with a name, attributes (class, style, ...), value and
     *   children, very similar to a HTML DOM tree), or `null` if no XFA exists.
     */
    getXfa(): Promise<unknown | null>;
    /**
     * Begins the process of rendering a page to the desired context.
     *
     * @param {RenderParameters} params - Page render parameters.
     * @returns {RenderTask} An object that contains a promise that is
     *   resolved when the page finishes rendering.
     */
    render({
      canvasContext,
      viewport,
      intent,
      annotationMode,
      transform,
      canvasFactory,
      background,
      optionalContentConfigPromise,
      annotationCanvasMap,
      pageColors,
      printAnnotationStorage,
    }: RenderParameters): RenderTask;
    /**
     * @param {GetOperatorListParameters} params - Page getOperatorList
     *   parameters.
     * @returns {Promise<PDFOperatorList>} A promise resolved with an
     *   {@link PDFOperatorList} object that represents the page's operator list.
     */
    getOperatorList({
      intent,
      annotationMode,
      printAnnotationStorage,
    }?: GetOperatorListParameters): Promise<PDFOperatorList>;
    /**
     * NOTE: All occurrences of whitespace will be replaced by
     * standard spaces (0x20).
     *
     * @param {getTextContentParameters} params - getTextContent parameters.
     * @returns {ReadableStream} Stream for reading text content chunks.
     */
    streamTextContent({
      disableCombineTextItems,
      includeMarkedContent,
    }?: getTextContentParameters): ReadableStream;
    /**
     * NOTE: All occurrences of whitespace will be replaced by
     * standard spaces (0x20).
     *
     * @param {getTextContentParameters} params - getTextContent parameters.
     * @returns {Promise<TextContent>} A promise that is resolved with a
     *   {@link TextContent} object that represents the page's text content.
     */
    getTextContent(params?: getTextContentParameters): Promise<TextContent>;
    /**
     * @returns {Promise<StructTreeNode>} A promise that is resolved with a
     *   {@link StructTreeNode} object that represents the page's structure tree,
     *   or `null` when no structure tree is present for the current page.
     */
    getStructTree(): Promise<StructTreeNode>;
    /**
     * Destroys the page object.
     * @private
     */
    private _destroy;
    /**
     * Cleans up resources allocated by the page.
     *
     * @param {boolean} [resetStats] - Reset page stats, if enabled.
     *   The default value is `false`.
     * @returns {boolean} Indicates if clean-up was successfully run.
     */
    cleanup(resetStats?: boolean | undefined): boolean;
    /**
     * Attempts to clean up if rendering is in a state where that's possible.
     * @private
     */
    private _tryCleanup;
    /**
     * @private
     */
    private _startRenderPage;
    /**
     * @private
     */
    private _renderPageChunk;
    /**
     * @private
     */
    private _pumpOperatorList;
    /**
     * @private
     */
    private _abortOperatorList;
    /**
     * @type {unknown} Returns page stats, if enabled; returns `null` otherwise.
     */
    get stats(): unknown;
  }
}
