const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/todoListExpressJS", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongodbga ulanish muvaffaqiyatli amalga oshdi !!!");
    })
    .catch(err => {
        console.log(err.message);
    });

const title = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now()
        },
        completed: {
            type: Boolean,
            default: false,
        },
        title: { type: String, trim: true, require: true },
    },
    { timestamps: true }
);

const titleSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId
        },
        titles: {
            type: [title],
            default: []
        }
    }
);

const TitlesDate = mongoose.model("todoListEexpressJSes", titleSchema);

async function postCreatUcer_id(_id) {
    mongoose.set('useFindAndModify', false);
    const userId = new TitlesDate({
        _id: _id,
    });

    return await userId.save();
}


async function getTodos(_id) {
    return await TitlesDate.findOne(
        { _id },
        function (err, docs) {
            if (docs) {
                console.log('getTodos');
            } else {
                console.log(err);
            }
        }
    )
}

async function postCreatTodo(id, title) {
    mongoose.set('useFindAndModify', false);
    return await TitlesDate.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                titles: {
                    title: title
                }
            }
        }
    );
}

async function getId(user_id, titleId) {
    console.log(titleId);
    let _id = mongoose.Types.ObjectId(user_id);
    let id = mongoose.Types.ObjectId(titleId);
    return await TitlesDate.aggregate([
        { $match: { _id: _id } },
        { $unwind: "$titles" },
        { $match: { 'titles._id': id } }
    ]);
}

async function deletModulTodo(user_id, titleId) {
    let _id = mongoose.Types.ObjectId(user_id);
    let id = mongoose.Types.ObjectId(titleId);
    return await TitlesDate.updateOne(
        { _id: _id },
        { $pull: { titles: { _id: id } } },
        { multi: true }
    )
}

async function patchModulCompleted(this_id, titleId, title) {
    let _id = mongoose.Types.ObjectId(this_id);
    let id = mongoose.Types.ObjectId(titleId);
    mongoose.set('useFindAndModify', true);
    let boolean = title.completed
    if (boolean) {
        boolean = false;
    } else {
        boolean = true;
    }
    return await TitlesDate.updateOne(
        { _id: _id },
        { $set: { "titles.$[element].completed": boolean } },
        { arrayFilters: [{ "element._id": { $eq: id } }] }
    );
}

async function putModulTitle(user_id, titleId, title) {
    let _id = mongoose.Types.ObjectId(user_id);
    let id = mongoose.Types.ObjectId(titleId);
    mongoose.set('useFindAndModify', false);
    return await TitlesDate.findOneAndUpdate(
        { _id: _id },
        {
            $set: {
                "titles.$[element].title": title,
                "titles.$[element].date": new Date()
            }
        },
        { arrayFilters: [{ "element._id": { $eq: id } }] }
    );
}

module.exports = {
    getTodos,
    postCreatTodo,
    getId,
    deletModulTodo,
    patchModulCompleted,
    putModulTitle,
    postCreatUcer_id
}