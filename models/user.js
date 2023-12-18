// разкомментить строчки с ошибками после добавления их

// email - обязательное поле, уникальное, валидация
// password - обязательное поле, строка, БЗ по умолчанию не возвращает данное поле
// name - обязательная строка, 2-30 символов

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Незаполнено поле name'],
      minlength: [2, 'Минимальная длина имени - 2 символа'],
      maxlength: [30, 'Максимальная длина имени - 30 символов'],
    },
    email: {
      type: String,
      required: [true, 'Незаполнено поле email'],
      unique: true,
      validate: {
        validator(mail) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            mail
          );
        },
        message: 'Введите email',
      },
    },
    password: {
      type: String,
      required: [true, 'Незаполнено поле password'],
      select: false,
    },
  },
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        //throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          //throw new UnauthorizedError('Неправильные почта или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
