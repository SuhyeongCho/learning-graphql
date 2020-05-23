/** 고유 ID를 만들기 위해 값을 하나씩 증가시킬 변수입니다. */
let _id = 0;

module.exports = {
  postPhoto(parent, args) {
    /** 새로운 사진을 만들고 id를 부여합니다. */
    const newPhoto = {
      id: _id++,
      ...args.input,
      created: new Date()
    };
    photos.push(newPhoto);
    return newPhoto;
  }
};
