export default async function fetchUserInfo(uid) {
  const url = `/api/user_api/v1/user/get?spider=0&user_id=${uid}&not_self=1&need_badge=1`
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.err_msg !== 'success') reject(res.err_msg)
        else resolve(res)
      })
  })
}
