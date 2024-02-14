// const asycHandler = (fu) => async (req, res, next) => {
// try {
//     await fu(req, res, next)
// } catch (error) {
//     res.status(500).json({
//         succes: false,
//         message: error})
// }
// }


const asycHandler = (fu) => async (req, res, next)=> {
return Promise.resolve(fu(req, res, next))
.catch((error)=> {
    next(error)
})
}

export {asycHandler}