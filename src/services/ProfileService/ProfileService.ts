import { UserProfile } from "../../core"
import { Api } from "../../core/EdxApp.types"
import httpService from "../HttpService/HttpService"
import { GetMyTenantsRequest, PostUserProfileExtensionRequest } from "./ProfileService.requests"
import { GetMyTenantsResponse, GetUsersListResponse, PostUserProfileExtensionResponse } from "./ProfileService.response"
import { GetMyTenantsResult, GetUserProfileResult, GetUsersListResult, PostTenantIdPreference, PostUserProfileExtensionResult } from "./ProfileService.result"

const fetchUserProfile = async (token: string, apiUrl: string, apiConfig?: Api) : GetUserProfileResult => {
    // const url = `${apiUrl}/me`
    const url = "/mockdata/data-userprofile.json"

    const result = await httpService.get<UserProfile>({
        url,
        actionName: "Get User Profile",
        access_token: token,
        apiConfig
    })
    
    return result
}

const getUser = async (token: string, apiUrl: string, tenantId: string, email: string, apiConfig?: Api) : GetUsersListResult => {
    const baseUrl = `${apiConfig?.baseUri ?? ''}/tenants/${tenantId}/users`

    let filter = ""
    if (email.includes("+")) {
        const valuesArray = email.split("+")
        filter = `pageIndex=0&pageSize=10&filter=email.toLower().contains("${valuesArray[0]}")&&email.toLower().contains("${valuesArray[1]}")&orderBy=firstName asc`
    }
    else 
        filter = `pageIndex=0&pageSize=10&filter=email.toLower().contains("${email}".toLower())&orderBy=firstName asc`

    const url = `${baseUrl}?${filter}`

    const result = await httpService.get<GetUsersListResponse>({
        url,
        actionName: 'Get User by Email',
        access_token: token,
        apiConfig
    })

    return result
}

const addUserExtension = async (token: string, apiUrl: string, request: PostUserProfileExtensionRequest, apiConfig?: Api) : PostUserProfileExtensionResult => {
    const url = `${apiConfig?.baseUri ?? ''}/me/extensions`

    const result = await httpService.post<PostUserProfileExtensionResponse, PostUserProfileExtensionRequest>({
        url,
        data: request,
        actionName: "Create/Update user extensions",
        access_token: token,
        apiConfig
    })

    return result
}

const updateUserExtension = async (token: string, apiUrl: string, request: PostUserProfileExtensionRequest, apiConfig?: Api) : PostUserProfileExtensionResult => {
    return await addUserExtension(token, apiUrl, request, apiConfig)
}

const updateTenantIdPreference = async (token: string, tenantId: string, apiUrl: string, apiConfig?: Api): PostTenantIdPreference => {
    const url = `${apiConfig?.baseUri ?? ''}/me/preferences`
    const data = { code: 'selectedtenantid', value: tenantId }

    const result = await httpService.post<any, any>({
        url,
        data,
        actionName: 'Post User Preferences',
        access_token: token,
        apiConfig
    })

    return result
}

const getMyTenants = async (token: string, apiUrl: string, request: GetMyTenantsRequest, apiConfig?: Api): GetMyTenantsResult => {
    const baseUrl = `${apiConfig?.baseUri ?? ''}/me/tenants`

    let queryParams = `pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`

    if (request.filterBy)
        queryParams = `${queryParams}&filter=${request.filterBy}`
    if (request.orderBy)
        queryParams = `${queryParams}&orderBy=${request.orderBy}`

    const url = `${baseUrl}?${queryParams}`

    const result = await httpService.get<GetMyTenantsResponse>({
        url,
        actionName: 'Get My Tenants',
        access_token: token,
        apiConfig
    })

    return result
}

export {
    fetchUserProfile,
    getUser,
    getMyTenants,
    addUserExtension,
    updateUserExtension,
    updateTenantIdPreference
}