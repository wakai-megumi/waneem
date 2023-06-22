const CreateError = (statusCode, message) => {
    const error = new Error()
    error.message = message
    error.statusCode = statusCode
    console.log(error)
    return error
}
export default CreateError

