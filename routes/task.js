var express = require('express');
var router = express.Router();
const fs = require("fs");


/* GET Database. */
router.get('/', (req, res, next) => {
    fs.readFile("./database/db.json", 'utf8', (err, data) => {
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData.tasks)
    });
});

const getMaxId = (objectList) => {
    let maxTaskId = objectList.length ? objectList[0].id : 0;

    objectList.forEach(task => maxTaskId = Math.max(maxTaskId, task.id));

    return maxTaskId;
}

router.post('/', (req, res, next) => {
    const { title, description, category, date, priority, status } = req.body;

    const fileData = fs.readFileSync("./database/db.json", 'utf8');
    const parseData = JSON.parse(fileData);

    const maxTaskId = getMaxId(parseData.tasks);

    parseData.tasks.push({
        id: (maxTaskId + 1),
        title,
        description,
        category,
        date,
        priority,
        status
    });
    const fileDataToWrite = JSON.stringify(parseData, null, 4);


    fs.writeFile("./database/db.json", fileDataToWrite, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                data: err.message
            })
        }

        return res.status(200).json({
            success: true,
            data: "Task added successfully"
        })
    });
});

const getObjIndex = (objectList, id) => {
    return objectList.findIndex(obj => obj.id == id);
}
router.delete('/:id', (req, res, next) => {
    const { id: taskIdToDelete } = req.params;
    const fileData = fs.readFileSync("./database/db.json", 'utf8');
    const parseData = JSON.parse(fileData);

    const taskIndexToDelete = getObjIndex(parseData.tasks, taskIdToDelete);
    console.log(taskIndexToDelete,"==============");

    if (taskIdToDelete < 0) {
        return res.status(404).json({
            success: false,
            data: "No Task found with this id"
        })
    }
    else {
        parseData.tasks.splice(taskIndexToDelete, 1);
        const fileDataToWrite = JSON.stringify(parseData, null, 4);
        
        fs.writeFile("./database/db.json", fileDataToWrite, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    data: err.message
                })
            }

            return res.status(200).json({
                success: true,
                data: "Task deleted successfully"
            })
        });
    }
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    const fileData = fs.readFileSync("./database/db.json", 'utf8');
    const parseData = JSON.parse(fileData);

    const index = getObjIndex(parseData.tasks, id);

    if (index < 0) {
        return res.status(404).json({
            success: false,
            data: "No Task found with this id"
        })
    }
    else {

        return res.status(200).json(parseData.tasks[index])
    }
        
        
});



module.exports = router;