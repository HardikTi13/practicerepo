import bcrypt from 'bcrypt'

const hashkey=10;

export const hashPassword=(password)=>{
    const salt=bcrypt.genSaltSync(hashkey)
    console.log(salt);
    return bcrypt.hashSync(password,salt)
}

export const comparePassword=(plain,hashed)=>{
    return bcrypt.compareSync(plain,hashed)
}