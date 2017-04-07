import {
    showValidationErrors,
} from "./errorActions";
import {
  openErrorsModal
} from "./layoutActions";

export function generateActionFunc(type) {
    const func = function (obj) {
        const action = {
            type: type,
            ...obj
        }
        return action;
    }
    return func;
}
const CHANGE_FETCHING_STATUS = "CHANGE_FETCHING_STATUS";
export const changeFetchingStatus = generateActionFunc(CHANGE_FETCHING_STATUS);


export function fetchPost(url, data, handler, errorHandler) {
    var formBody = [];
    for (var property in data) {
      if(data.hasOwnProperty(property)) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
    }
    formBody = formBody.join("&");
    return function (dispatch, getState) {
        dispatch(changeFetchingStatus({
            status: true
        }));
        return fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody,
                credentials: 'include'
            }).then(response => response.json(), error => {
                debugger;
            })
            .then(json => {
                dispatch(changeFetchingStatus({
                    status: false
                }));
                if (json.data === false) {
                    dispatch(showValidationErrors({
                        errors: json.error
                    }));
                    dispatch(openErrorsModal({}));
                    if(errorHandler) {
                      errorHandler(dispatch);
                    }
                } else {
                  handler(json, dispatch, getState);
                }
            })
    }
}

export function fetchAsync(url, handler, errorHandler) {
    return function (dispatch, getState) {
        dispatch(changeFetchingStatus({
            status: true
        }));
        let newUrl = url;
        if(~newUrl.indexOf("?")) {
          newUrl += `&cacheBooster=${Math.random()*100}`
        } else {
          newUrl += `?cacheBooster=${Math.random()*100}`
        }
        return fetch(newUrl,{
          method: "GET",
          credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                dispatch(changeFetchingStatus({
                    status: false
                }));
                if (json.data === false) {
                    dispatch(showValidationErrors({
                        errors: json.error
                    }));
                    dispatch(openErrorsModal({}));
                    if(errorHandler) {
                      errorHandler(dispatch);
                    }
                } else {
                  handler(json, dispatch, getState);
                }
            })
    }
}
