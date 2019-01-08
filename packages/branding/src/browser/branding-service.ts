/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
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

import { ContributionProvider } from '@theia/core/src/common';
import { injectable, inject, named } from 'inversify';

export const BrandingResource = Symbol('BrandingResource');
export const BrandingService = Symbol('BrandingService');

/**
 * Available branding options.
 */
export enum BrandingType {
    /**
     * The main logo of the application, defaults to `Theia`.
     */
    MAIN_LOGO,
    /**
     * The menu logo of the application, defaults to `Theia`.
     */
    MENU_LOGO,
}

/**
 * `BrandingResource` should be implemented to provide a new branding option.
 */
export interface BrandingResource {
    /**
     * A unique identifier for this branding resource.
     */
    readonly id: string;
    /**
     * A human-readable name for this resource.
     */
    readonly label: string;
    /**
     * The branding resource type.
     */
    readonly type: BrandingType;
    /**
     * The path of the branding resource.
     */
    readonly path?: string;
}

/**
 * `BrandingService` provides an access to existing branding resources.
 */
export interface BrandingService {
    /**
     * Register a custom branding resource for a given type.
     *
     * @param type the branding resource type.
     * @param path the path of the resource.
     */
    setResource(type: BrandingType, path: string): Promise<void>;
}

@injectable()
export class DefaultBrandingService implements BrandingService {

    @inject(ContributionProvider) @named(BrandingResource)
    protected readonly brandingProvider: ContributionProvider<BrandingResource>;

    mainLogoPath = '../../src/browser/style/variables-dark.useable.css';
    menuLogoPath = '../../src/browser/style/variables-light.useable.css';

    async setResource(type: BrandingType, path: string): Promise<void> {
        if (type === BrandingType.MAIN_LOGO) {
            this.mainLogoPath = path;
        } else if (type === BrandingType.MENU_LOGO) {
            this.menuLogoPath = path;
        }
    }

    getResource(type: BrandingType): string {
        if (type === BrandingType.MAIN_LOGO) {
            return this.mainLogoPath;
        } else if (type === BrandingType.MENU_LOGO) {
            return this.menuLogoPath;
        }
        return '';
    }
}
