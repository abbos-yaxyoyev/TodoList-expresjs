const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/todoListExpressJS", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongodbga ulanish muvaffaqiyatli amalga oshdi !!!");
    })
    .catch(err => {
        console.log(err.message);
    });


const userSchema = new mongoose.Schema(
    {
        completed: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date,
            default: new Date()
        },
        title: { type: String, trim: true, require: true },
    },
    { timestamps: true }
);
const UserstDate = mongoose.model("todoListEexpressjs", userSchema);

async function getTodos() {
    return await UserstDate.find(
        {},
        function (err, docs) {
            if (docs) {
                console.log(docs, 'getTodos');
            } else {
                console.log(err);
            }
        }
    )
}


async function postCreatTodo(title) {
    mongoose.set('useFindAndModify', false);
    const user = new UserstDate({
        title: title,
        date: Date.now()
    });
    return await user.save();
}

async function getId(id) {
    return await UserstDate.findOne({ _id: id });
}

async function deletModulTodo(id) {
    let docs1;
    await UserstDate.findOneAndDelete(
        { _id: id },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                docs1 = docs;
            }
        }
    )
    return await docs1;
}

async function patchModulCompleted(id, user) {
    mongoose.set('useFindAndModify', true);
    let boolean = user.completed
    if (boolean) {
        boolean = false;
    } else {
        boolean = true;
    }
    return await UserstDate.updateOne(
        { _id: id },
        {
            $set: {
                completed: boolean
            }
        }
    )
}

async function putModulTitle(id, title) {
    mongoose.set('useFindAndModify', false);
    return await UserstDate.findByIdAndUpdate(
        { _id: id },
        {
            $set: {
                title: title,
                date: Date.now()
            }
        },
        { new: true }
    )
}

module.exports = { getTodos, postCreatTodo, getId, deletModulTodo, patchModulCompleted, putModulTitle }