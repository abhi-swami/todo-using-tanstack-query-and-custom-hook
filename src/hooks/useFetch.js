const BASE_URL = `http://localhost:8080/`

export const useFetch = (baseURL = BASE_URL) => {
    const getMehtod = (endPoint) => {
        return new Promise((resolve, reject) => {
            fetch(baseURL + endPoint)
                .then((res) => res.json())
                .then(data => {
                    if (!data) {
                        return reject("no data is provided")
                    } else {
                        return resolve(data)
                    }
                })
                .catch(error => reject(error))

        })
    }

    const otherMethod = (endPoint, method, data) => {
        return new Promise((resolve, reject) => {
            fetch(baseURL + endPoint, {
                method,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data) {
                        return reject("no data is provided")
                    }
                    resolve(data);
                })
                .catch((error) => reject(error))
        })
    }



    return { getMehtod, otherMethod }
}