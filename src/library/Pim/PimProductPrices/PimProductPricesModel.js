/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import BaseItemModel from 'aesirx-dma-lib/src/Abstract/BaseItemModel';
import BaseModel from 'store/Models/Abstract/BaseModel';
import { PIM_PRICES_DETAIL_FIELD_KEY } from '../../Constant/PimConstant';

class ProductPriceModel extends BaseModel {
  constructor(entities) {
    super(entities);
    if (entities) {
      this.items = entities._embedded.item.map((element) => {
        return new ProductPriceItemModel(element);
      });
    }
  }
}
class ProductPriceItemModel extends BaseItemModel {
  id = null;
  published = 0;
  created_user_name = null;
  modified_time = null;
  custom_fields = null;
  products = null;
  featured = 0;
  modified_user_name = null;
  created_time = null;

  constructor(entity) {
    super(entity);
    if (entity) {
      this.id = entity[PIM_PRICES_DETAIL_FIELD_KEY.ID] ?? '';
      this.published = entity[PIM_PRICES_DETAIL_FIELD_KEY.PUBLISHED] ?? 0;
      this.created_user_name = entity[PIM_PRICES_DETAIL_FIELD_KEY.CREATED_USER_NAME] ?? '';
      this.modified_time = entity[PIM_PRICES_DETAIL_FIELD_KEY.MODIFIED_TIME] ?? '';
      this.custom_fields = entity[PIM_PRICES_DETAIL_FIELD_KEY.CUSTOM_FIELDS] ?? null;
      this.products = entity[PIM_PRICES_DETAIL_FIELD_KEY.PRODUCTS] ?? [];
      this.featured = entity[PIM_PRICES_DETAIL_FIELD_KEY.FEATURED] ?? [];
      this.modified_user_name = entity[PIM_PRICES_DETAIL_FIELD_KEY.MODIFIED_USER_NAME] ?? [];
      this.created_time = entity[PIM_PRICES_DETAIL_FIELD_KEY.CREATED_TIME] ?? [];
    }
  }

  toJSON = () => {
    return {
      ...this.baseToJSON(),
      [PIM_PRICES_DETAIL_FIELD_KEY.ID]: this.id,
      [PIM_PRICES_DETAIL_FIELD_KEY.PUBLISHED]: this.published,
      [PIM_PRICES_DETAIL_FIELD_KEY.CREATED_USER_NAME]: this.created_user_name,
      [PIM_PRICES_DETAIL_FIELD_KEY.MODIFIED_TIME]: this.modified_time,
      [PIM_PRICES_DETAIL_FIELD_KEY.CUSTOM_FIELDS]: this.custom_fields,
      [PIM_PRICES_DETAIL_FIELD_KEY.PRODUCTS]: this.products,
      [PIM_PRICES_DETAIL_FIELD_KEY.FEATURED]: this.featured,
      [PIM_PRICES_DETAIL_FIELD_KEY.MODIFIED_USER_NAME]: this.modified_user_name,
      [PIM_PRICES_DETAIL_FIELD_KEY.CREATED_TIME]: this.created_time,
    };
  };
}

export { ProductPriceModel };
