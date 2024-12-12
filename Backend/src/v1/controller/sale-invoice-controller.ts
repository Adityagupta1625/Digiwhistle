import { BaseController, errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import { SaleInvoiceDTO } from '../dtos/sale-invoice-dtos'
import { IExtendedRequest } from '../interface'
import {
  ISaleInvoice,
  ISaleInvoiceCRUD,
  ISaleInvoiceService,
} from '../modules/invoice/interface'
import { Request, Response } from 'express'

export class SaleInvoiceController extends BaseController<
  ISaleInvoice,
  ISaleInvoiceCRUD,
  ISaleInvoiceService
> {
  constructor(saleInvoiceService: ISaleInvoiceService) {
    super(saleInvoiceService)
  }

  async getAllController(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { page, limit } = req.query
      if (typeof page !== 'string' || typeof limit !== 'string')
        throw new HttpException(400, 'Invalid Page Details')

      const { invoiceNo } = req.query
      const { startDate, endDate } = req.query

      if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        throw new HttpException(400, 'Invalid Date')
      }

      const lowerBound = new Date(startDate)
      const upperBound = new Date(endDate)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startDate
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endDate)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      const data = await this.service.getAllSaleInvoices(
        parseInt(page),
        parseInt(limit),
        lowerBound,
        upperBound,
        invoiceNo as string
      )

      const _data = data.data.map((value) => {
        return SaleInvoiceDTO.transformationForSaleInvoice(value)
      })

      return responseHandler(
        200,
        res,
        'Fetched Successfully',
        {
          data: _data,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async shareInvoiceController(req: Request, res: Response): Promise<Response> {
    try {
      await this.service.shareSaleInvoice(req.body)
      return responseHandler(200, res, 'Shared Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async downloadSaleInvoiceController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.query

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      const url = await this.service.downloadSaleInvoice(id)

      return responseHandler(
        200,
        res,
        'Downloaded Successfully',
        { url: url },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async downloadSaleInvoiceReportController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { startDate, endDate } = req.body

      if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        throw new HttpException(400, 'Invalid Date')
      }

      const lowerBound = new Date(startDate)
      const upperBound = new Date(endDate)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startDate
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endDate)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      const url = await this.service.downloadSaleInvoiceReport(
        lowerBound,
        upperBound
      )

      return responseHandler(
        200,
        res,
        'Downloaded Successfully',
        { url: url },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
