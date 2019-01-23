/********************************************************************************
 * Copyright (C) 2019 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { RequestType, RequestHandler } from 'vscode-jsonrpc';
import { Location, SymbolKind, Range } from 'vscode-languageserver-types';
import * as lsp from 'vscode-languageserver';

export interface CallHierarchyClientCapabilities {
    /**
     * The text document client capabilities
     */
    textDocument?: {
        /**
         * Capabilities specific to the `textDocument/callHierarchy`
         */
        callHierarchy?: {
            /**
             * Whether implementation supports dynamic registration. If this is set to `true`
             * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
             * return value for the corresponding server capability as well.
             */
            dynamicRegistration?: boolean;
        };
    }
}

export interface CallHierarchyServerCapabilities {
    /**
     * The server provides Call Hierarchy support.
     */
    callHierarchyProvider?: boolean | (lsp.TextDocumentRegistrationOptions & lsp.StaticRegistrationOptions);
}

/**
 * Request to request the call hierarchy at a given text document position.
 *
 * The request's parameter is of type [CallHierarchyParams](#CallHierarchyParams). The response
 * is of type [CallHierarchyItem](#CallHierarchyItem) or a Thenable that resolves to such.
 *
 * The optional request's parameter defines the maximum number of levels to [resolve](#CallHierarchyParams.resolve) by this request.
 * Unresolved items can be resolved in subsequent `callHierarchy/resolve` requests.
 */
export namespace CallHierarchyRequest {
    export const type = new RequestType<CallHierarchyParams, CallHierarchyItem, void, lsp.TextDocumentRegistrationOptions>('textDocument/callHierarchy');
    export type HandlerSignature = RequestHandler<CallHierarchyParams, CallHierarchyItem | null, void>;
}

/**
 * Request to resolve a call hierarchy item.
 *
 * The request's parameter is of type [ResolveCallHierarchyItemParams](#ResolveCallHierarchyItemParams). The response
 * is of type [CallHierarchyItem](#CallHierarchyItem) or a Thenable that resolves to such.
 */
export namespace CallHierarchyResolveRequest {
    export const type = new RequestType<ResolveCallHierarchyItemParams, CallHierarchyItem, void, void>('callHierarchy/resolve');
    export type HandlerSignature = RequestHandler<ResolveCallHierarchyItemParams, CallHierarchyItem | null, void>;
}

/**
 * The parameters of a `textDocument/callHierarchy` request.
 */
export interface CallHierarchyParams extends lsp.TextDocumentPositionParams {
    /**
     * The number of levels to resolve.
     */
    resolve?: number;
    /**
     * Outgoing direction for callees.
     * The default is incoming for callers.
     */
    direction?: 'incoming' | 'outgoing';
}

/**
 * The parameters of a `callHierarchy/resolve` request.
 */
export interface ResolveCallHierarchyItemParams {
    /**
     * Unresolved item.
     */
    item: CallHierarchyItem;
    /**
     * The number of levels to resolve.
     */
    resolve: number;
    /**
     * Outgoing direction for callees.
     * The default is incoming for callers.
     */
    direction: 'incoming' | 'outgoing';
}

/**
 * The result of a `textDocument/callHierarchy` request.
 */
export interface CallHierarchyItem {
    /**
     * The name of the symbol targeted by the call hierarchy request.
     */
    name: string;
    /**
     * More detail for this symbol, e.g the signature of a function.
     */
    detail?: string;
    /**
     * The kind of this symbol.
     */
    kind: SymbolKind;
    /**
     * URI of the document containing the symbol.
     */
    uri: string;
    /**
     * The range enclosing this symbol not including leading/trailing whitespace but everything else
     * like comments. This information is typically used to determine if the the clients cursor is
     * inside the symbol to reveal in the symbol in the UI.
     */
    range: Range;
    /**
     * The range that should be selected and revealed when this symbol is being picked, e.g the name of a function.
     * Must be contained by the the `range`.
     */
    selectionRange: Range;

    /**
     * The actual location of the call.
     *
     * **Must be defined** in resolved callers/callees.
     */
    callLocation?: Location;

    /**
     * List of incoming calls.
     *
     * *Note*: The items is _unresolved_ if `callers` and `callees` is undefined.
     */
    callers?: CallHierarchyItem[];
    /**
     * List of outgoing calls.
     *
     * *Note*: The items is _unresolved_ if `callers` and `callees` is undefined.
     */
    callees?: CallHierarchyItem[];
    /**
     * Optional data to identify an item in a resolve request.
     */
    // tslint:disable-next-line:no-any
    data?: any;
}
