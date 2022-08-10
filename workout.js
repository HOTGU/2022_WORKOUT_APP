const controlBtn = document.getElementById("workout-control-btn");
const timer = document.getElementById("timer");
const inputs = document.querySelectorAll("input");
const recordContainer = document.getElementById("record-container");
const pushupContaienr = document.getElementById("pushup-container");
const pullupContaienr = document.getElementById("pullup-container");
const squatContaienr = document.getElementById("squat-container");
const result = document.getElementById("result");

let second = 0;
let intervalId;
let totalPushup = 0;
let totalPullup = 0;
let totalSquat = 0;
let workoutData = JSON.parse(localStorage.getItem("workout")) || [];

let dataObj = {
    pushup: [],
    pullup: [],
    squat: [],
};

const convertTimer = (value) => {
    let showSecond;
    let showMinite;
    showSecond = String(value % 60);
    showMinite = String(parseInt(value / 60, 10));
    showSecond = showSecond < 10 ? "0" + showSecond : showSecond;
    showMinite = showMinite < 10 ? "0" + showMinite : showMinite;
    return { showMinite, showSecond };
};

const startTimer = () => {
    recordContainer.classList.remove("toggle");
    intervalId = setInterval(() => {
        second = second + 1;
        controlBtn.innerText = "운동종료";
        const { showMinite, showSecond } = convertTimer(second);
        timer.innerText = `${showMinite} : ${showSecond}`;
    }, 1000);
};

const stopTimer = () => {
    clearInterval(intervalId);
    controlBtn.innerText = "운동완료";
    recordContainer.classList.add("toggle");

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;

    dataObj.pushup.forEach((item) => {
        totalPushup = totalPushup + Number(item.value);
    });
    dataObj.pullup.forEach((item) => {
        totalPullup = totalPullup + Number(item.value);
    });
    dataObj.squat.forEach((item) => {
        totalSquat = totalSquat + Number(item.value);
    });

    if (workoutData.length > 0) {
        const checkSameDay = workoutData.find(
            (item) => item.month === month && item.day === day
        );

        if (checkSameDay) {
            const updatedArr = workoutData.map((item) => {
                if (item.month === month && item.day === day) {
                    item.data.pushup += totalPushup;
                    item.data.pullup += totalPullup;
                    item.data.squat += totalSquat;
                    item.time += second;
                }
                return item;
            });
            localStorage.setItem("workout", JSON.stringify(updatedArr));
        } else {
            workOutObj = {
                day,
                month,
                time: second,
                data: {
                    pushup: totalPushup,
                    pullup: totalPullup,
                    squat: totalSquat,
                },
            };
            workoutData.push(workOutObj);
            localStorage.setItem("workout", JSON.stringify(workoutData));
        }
        const { showMinite, showSecond } = convertTimer(second);
        window.alert(
            `👋${showMinite}분 ${showSecond}초 동안 푸쉬업:${totalPushup}개 풀업:${totalPullup}개 스쿼트:${totalSquat}개 했습니다👋`
        );
        window.location.href = "./index.html";
    }
};

const handleControl = () => {
    if (controlBtn.innerText === "운동시작") {
        startTimer();
    }
    if (controlBtn.innerText === "운동종료") {
        stopTimer();
    }
};

const createBox = (value, id, target) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("countBox");
    const count = document.createElement("div");
    count.innerText = `${value}개`;
    count.classList.add("countBox__text");

    const deleteBtn = document.createElement("div");
    deleteBtn.innerText = "❌";
    deleteBtn.classList.add("countBox__btn");

    deleteBtn.addEventListener("click", () => {
        wrapper.remove();
        if (target.id === "pushup-container") {
            const filterdPushupArr = dataObj.pushup.filter((item) => item.id !== id);
            dataObj.pushup = filterdPushupArr;
            return;
        }
        if (target.id === "pullup-container") {
            const filterdPullupArr = dataObj.pullup.filter((item) => item.id !== id);
            dataObj.pullup = filterdPullupArr;
            return;
        }
        if (target.id === "squat-container") {
            const filterdSquatArr = dataObj.squat.filter((item) => item.id !== id);
            dataObj.squat = filterdSquatArr;
            return;
        }
    });
    wrapper.append(count);
    wrapper.append(deleteBtn);
    target.append(wrapper);
};

const handleKeydown = (e) => {
    const {
        target: { id, value },
        which,
        keyCode,
    } = e;
    var charCode = which ? which : keyCode;
    if (charCode === 13) {
        if (e.target.value === "") return;
        const randomId = Date.now();
        if (id === "pushup") {
            dataObj.pushup.push({ id: randomId, value });
            createBox(value, randomId, pushupContaienr);
        }
        if (id === "pullup") {
            dataObj.pullup.push({ id: randomId, value });
            createBox(value, randomId, pullupContaienr);
        }
        if (id === "squat") {
            dataObj.squat.push({ id: randomId, value });
            createBox(value, randomId, squatContaienr);
        }
        e.target.value = "";
    }
};

const init = () => {
    controlBtn.addEventListener("click", handleControl);
    inputs.forEach((input) => input.addEventListener("keyup", handleKeydown));
};

init();
