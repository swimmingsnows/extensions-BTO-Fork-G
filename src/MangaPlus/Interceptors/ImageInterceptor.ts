import {
  Request,
  RequestInterceptor,
  Response,
} from "paperback-extensions-common"
import { ByteArray } from "paperback-extensions-common/dist/models/RawData"
import { MANGAPLUS_DOMAIN, uuid } from "./Utility"

export class ImageInterceptor implements RequestInterceptor {
  stateManager = createSourceStateManager({})

  interceptRequest = async (request: Request): Promise<Request> => {
    const encryptionKey = request.url.match(/[?&]encryptionKey=([^&]\w+)&?/)
    if (encryptionKey == null || encryptionKey[1] == null) return request

    // @ts-ignore
    request.headers = {
      ...(request.headers ?? {}),
      ...{
        origin: MANGAPLUS_DOMAIN,
        referer: MANGAPLUS_DOMAIN,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
        "session-token": uuid(),
      },
    }

    // Change the url and remove the encryptionKey to avoid detection.
    request.url = request.url.split("?")[0]
    await this.encryptionKey.set(encryptionKey[1])
    return request
  }
  interceptResponse = async (response: Response): Promise<Response> => {
    response.headers.contentType =
      response.headers["content-type"] || "image/jpeg"

    const encryptionKey = await this.encryptionKey.get()

    if (encryptionKey) {
      response.rawData = this.decodeImage(
        encryptionKey,
        createByteArray(response.rawData)
      )
    }

    return response
  }

  encryptionKey = {
    get: async (): Promise<string | undefined> => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.stateManager.keychain.retrieve("encryptionKey")
    },
    set: async (encryptionKey: string | undefined): Promise<void> => {
      await this.stateManager.keychain.store("encryptionKey", encryptionKey)
    },
  }

  private decodeImage(encryptionKey: string, image: ByteArray) {
    const HEX_GROUP = /(.{1,2})/g
    const keyStream = Array.from(
      encryptionKey.matchAll(HEX_GROUP),
      (x) => parseInt(x[1]),
      16
    )
    const blockSizeInBytes = keyStream.length

    image.forEach(
      (value, i) => (image[i] = value ^ keyStream[i % blockSizeInBytes])
    )

    return createRawData(new Uint8Array(image))
  }
}
