const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds =  10 // salt가 몇글자인지 나타낸것
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: { //로그인 토큰
    type: String
  },
  tokenExp: { //토큰 유효기간
    type: Number
  }
})

userSchema.pre('save', function( next ) { // user 정보 저장전에 함수실행
  const user = this;

  // 비밀번호를 암호화 시킨다. 
  if(user.isModified('password')) {// password 만 변환될 때만.
    bcrypt.getSalt(saltRounds, function(err, salt) {
      if(err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next() // next 호출 시 save 동작
      })
    })  
  } else {
    next() // next 호출 시 save 동작
  }
})
userSchema.methods.comparePassword = function(plainPassword, cb) {
  //plainPassword : 1234567  암호 : $2b$10$x.jsZ8LUD3waqYvtmiFo5ufu5J7/FS.JbmjBZg2HOofS77bee29zO
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    else return cb(null, isMatch);
  })
}

userSchema.methods.generateToken = function(cb) {
  const user = this;

  //jsonwebtoken을 이용해서 토큰 생성하기
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  /**
   * user._id + 'secretToken' = token
   * ->
   * 'secretToken' -> user._id 
   * 토큰 생성 규칙은 다른데 더 자세히 나오니께.. 그거 봐
   */
  user.token = token;
  user.save(function(err, user){
    if(err) return cb(err)
    else return cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb) {
  const user = this;
  // 토큰을 디코드한다.
  jwt.verify(token, 'secretToken', function(err, decoded){
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function(err, user){
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema);
module.exports = {User};
