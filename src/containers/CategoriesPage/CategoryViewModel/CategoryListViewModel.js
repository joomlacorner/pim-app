/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import { notify } from '../../../components/Toast';
import { PIM_CATEGORY_DETAIL_FIELD_KEY } from 'aesirx-dma-lib';
import moment from 'moment';
class CategoryListViewModel {
  categoryStore = null;
  formStatus = PAGE_STATUS.READY;
  categoryListViewModel = null;
  items = [];
  filter = {};
  successResponse = {
    state: false,
    content_id: '',
    listPublishStatus: [],
    1: [],
    filters: {
      'list[limit]': 10,
    },
  };

  constructor(categoryStore) {
    makeAutoObservable(this);
    this.categoryStore = categoryStore;
  }

  setForm = (categoryListViewModel) => {
    this.categoryListViewModel = categoryListViewModel;
  };

  initializeData = async () => {
    this.formStatus = PAGE_STATUS.LOADING;

    await this.categoryStore.getList(
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHandler,
      this.successResponse.filters
    );

    await this.categoryStore.getListPublishStatus(
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHandler
    );
    this.successResponse.state = true;
  };

  initializeDataCustom = async () => {
    this.formStatus = PAGE_STATUS.LOADING;
    await this.categoryStore.getList(
      this.callbackOnSuccessHandlerCustom,
      this.callbackOnErrorHandler,
      this.filter
    );
  };
  callbackOnSuccessHandlerCustom = (result) => {
    this.items = result.listItems;
    this.formStatus = PAGE_STATUS.READY;
  };

  getListByFilter = async (key, value) => {
    value ? (this.successResponse.filters[key] = value) : delete this.successResponse.filters[key];

    //pagination
    if (key != 'limitstart' && key != 'list[limit]') {
      delete this.successResponse.filters['limitstart'];
    } else {
      if (
        key == 'list[limit]' &&
        value * this.successResponse.pagination.page >= this.successResponse.pagination.totalItems
      ) {
        this.successResponse.filters['limitstart'] =
          Math.ceil(this.successResponse.pagination.totalItems / value - 1) * value;
      } else if (
        key == 'list[limit]' &&
        value * this.successResponse.pagination.page < this.successResponse.pagination.totalItems
      ) {
        this.successResponse.filters['limitstart'] =
          (this.successResponse.pagination.page - 1) * value;
      }
    }

    await this.categoryStore.getList(
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHandler,
      this.successResponse.filters
    );

    this.successResponse.state = true;
  };

  setPublished = async (id, state = 0) => {
    await this.categoryStore.updateCategory(
      { id: id.toString(), published: state.toString() },
      this.callbackOnSuccessSetPublished,
      this.callbackOnErrorHandler
    );

    await this.categoryStore.getList(
      this.callbackOnSuccessHandler,
      this.callbackOnErrorHandler,
      this.successResponse.filters
    );

    this.successResponse.state = true;
  };

  updateStatus = async (arr, status = 0) => {
    const res = await this.categoryStore.updateStatus(arr, status);
    if (res) {
      await this.categoryStore.getList(
        this.callbackOnSuccessHandler,
        this.callbackOnErrorHandler,
        this.successResponse.filters
      );
    }
    this.successResponse.state = true;
  };

  handleFilter = (filter) => {
    this.filter = { ...this.filter, ...filter };
  };

  callbackOnErrorHandler = (error) => {
    notify('Update unsuccessfully', 'error');
    this.successResponse.state = false;
    this.successResponse.content_id = error.result;
    this.formStatus = PAGE_STATUS.READY;
  };

  callbackOnCreateSuccessHandler = (result) => {
    if (result) {
      notify('Create successfully', 'success');
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  callbackOnSuccessHandler = (result) => {
    if (result?.listItems) {
      this.successResponse.listCategories = this.transform(result.listItems);
      this.successResponse.pagination = result.pagination;
      // Need improve response
      this.items = result.listItems;
    }

    if (result?.listPublishStatus) {
      this.successResponse.listPublishStatus = result.listPublishStatus;
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  callbackOnSuccessSetPublished = async (result) => {
    this.successResponse.listCategories = this.successResponse.listCategories.map((o) => {
      if (o.category.id == result) {
        return { ...o, published: { ...o.published, state: !o.published.state } };
      }
      return o;
    });
  };

  transform = (data) => {
    return data.map((o) => {
      const date = moment(o[PIM_CATEGORY_DETAIL_FIELD_KEY.MODIFIED_TIME]).format('DD MMM, YYYY');
      return {
        category: {
          id: o[PIM_CATEGORY_DETAIL_FIELD_KEY.ID],
          name: o[PIM_CATEGORY_DETAIL_FIELD_KEY.TITLE],
          level: o[PIM_CATEGORY_DETAIL_FIELD_KEY.LEVEL],
        },
        productQuantity: o[PIM_CATEGORY_DETAIL_FIELD_KEY.PRODUCT_QUANTITY],
        lastModified: {
          status: o[PIM_CATEGORY_DETAIL_FIELD_KEY.PUBLISHED],
          dateTime: date ?? '',
          author: o[PIM_CATEGORY_DETAIL_FIELD_KEY.CREATED_USER_NAME],
        },
        published: {
          state: o[PIM_CATEGORY_DETAIL_FIELD_KEY.PUBLISHED],
          id: o[PIM_CATEGORY_DETAIL_FIELD_KEY.ID],
        },
        parentName: o[PIM_CATEGORY_DETAIL_FIELD_KEY.PARENT_NAME],
      };
    });
  };

  isLoading = () => {
    this.successResponse.state = false;
  };
}

export default CategoryListViewModel;
