import {
  Request,
  RequestInterceptor,
  Response,
} from "paperback-extensions-common"
import { TITLE_THUMBNAIL_PATH } from "./Utility"

export class ThumbnailInterceptor implements RequestInterceptor {
  requestManager = createRequestManager({
    requestsPerSecond: 5,
    requestTimeout: 20000,
  })
  stateManager = createSourceStateManager({})

  interceptRequest = async (request: Request): Promise<Request> => {
    return request
  }
  interceptResponse = async (response: Response): Promise<Response> => {
    let isBadCode = response.status == 401 || response.status == 404

    let url = response.request.url
    if (isBadCode && url.includes(TITLE_THUMBNAIL_PATH)) {
      let titleId = parseInt(
        url.split(`/${TITLE_THUMBNAIL_PATH}`)[0].split("/").pop() ?? ""
      )

      let title = // @ts-ignore
        (await this.stateManager.retrieve("titleList"))?.find(
          (id: any) => id == titleId
        ) ?? response

      let request = createRequestObject({
        url: title.portraitImageUrl,
        method: "GET",
        headers: response.request.headers,
      })

      return await this.requestManager.schedule(request, 1)
    }

    return response
  }
}
