// fake db create
// let fakeDB = [];

// const createFakeDB = (month) => {
//     for (let i = 1; i < 31; i++) {
//         const fakeObj = {
//             day: i,
//             month,
//             time: Math.floor(Math.random() * 1000),
//             data: {
//                 pushup: Math.floor(Math.random() * 100),
//                 pullup: Math.floor(Math.random() * 100),
//                 squat: Math.floor(Math.random() * 100),
//             },
//         };
//         fakeDB.push(fakeObj);
//     }
//     localStorage.setItem("workout", JSON.stringify(fakeDB));
// };
// createFakeDB(7);
// createFakeDB(8);

const chart = document.getElementById("chart");
const select = document.getElementById("month-select");
const count = document.getElementById("count");

const createOtions = () => {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    for (let i = 1; i < 13; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = `${i}월`;
        if (i === currentMonth) {
            option.selected = true;
        }
        select.append(option);
    }
};

const filterdByMonth = (month) => {
    const filterdMonth = JSON.parse(localStorage.getItem("workout")).filter((item) => {
        if (item.month === month) return true;
    });
    return filterdMonth;
};

const getData = (arr) => {
    const pushupArr = arr.map((item) => {
        return item.data.pushup;
    });
    const pullupArr = arr.map((item) => {
        return item.data.pullup;
    });
    const squatArr = arr.map((item) => {
        return item.data.squat;
    });
    const timeArr = arr.map((item) => {
        return item.time;
    });
    return {
        pushupArr,
        pullupArr,
        squatArr,
        timeArr,
    };
};

const getTotalData = (data) => {
    let totalPushup = 0;
    let totalPullup = 0;
    let totalSquat = 0;
    let totalTime = 0;
    data.pushupArr.forEach((item) => {
        totalPushup += item;
    });
    data.pullupArr.forEach((item) => {
        totalPullup += item;
    });
    data.squatArr.forEach((item) => {
        totalSquat += item;
    });
    data.timeArr.forEach((item) => {
        totalTime += item;
    });
    return {
        totalPushup,
        totalPullup,
        totalSquat,
        totalTime,
    };
};

const getDay = (arr) => {
    const dayArr = arr.map((item) => {
        return item.day;
    });
    return dayArr;
};

const configOption = (data, categories) => {
    return {
        series: [
            {
                name: "푸쉬업",
                type: "column",
                data: data.pushupArr,
            },
            {
                name: "턱걸이",
                type: "column",
                data: data.pullupArr,
            },
            {
                name: "스쿼트",
                type: "column",
                data: data.squatArr,
            },
            {
                name: "소요시간",
                data: data.timeArr,
                type: "line",
                stroke: {
                    show: true,
                },
            },
        ],
        chart: {
            type: "line",
            stacked: true,
            height: 500,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 3,
                columnWidth: "50%",
            },
        },
        stroke: { width: [0, 0, 0, 3], curve: "smooth" },
        colors: ["#1B1464", "#8e44ad", "#d35400", "#f5cd79"],
        title: {
            text: "운동차트",
            align: "center",
            style: {
                fontSize: "24px",
                color: "white",
            },
        },
        tooltip: {
            y: {
                formatter: function (value, { seriesIndex }) {
                    if (seriesIndex === 3) {
                        return `${value}초`;
                    } else {
                        return `${value}개`;
                    }
                },
            },
        },
        xaxis: {
            categories,
            style: {
                color: "white",
                fontSize: "16px",
            },
            labels: {
                formatter: (value) => `${value}일`,
            },
        },
        yaxis: [
            {
                seriesName: "푸쉬업",
                title: {
                    text: "갯수",
                    style: {
                        color: "white",
                        fontSize: "16px",
                    },
                },
            },
            {
                seriesName: "푸쉬업",
                show: false,
            },
            {
                seriesName: "푸쉬업",
                show: false,
            },
            {
                seriesName: "소요시간",
                opposite: true,
                title: {
                    text: "초",
                    style: {
                        color: "white",
                        fontSize: "16px",
                    },
                },
            },
        ],
    };
};

const paintChart = (option, target) => {
    target.innerHTML = "";
    let apexChart = new ApexCharts(target, option);
    apexChart.render();
};

const paintResult = (data, month) => {
    const { totalPushup, totalPullup, totalSquat, totalTime } = getTotalData(data);

    const minite = parseInt(totalTime / 60, 10);
    const second = totalTime % 60;
    count.innerHTML = "";
    const head = document.createElement("div");
    head.innerText = `${month}월의 운동량`;
    head.id = "count-head";
    const column1 = document.createElement("div");
    column1.innerText = `🔥 총 ${minite}분 ${second}초 운동했습니다`;
    column1.classList.add("count-text");
    const column2 = document.createElement("div");
    column2.innerText = `🔥 푸쉬업:${totalPushup}개 풀업:${totalPullup}개 스쿼트:${totalSquat}개 했습니다`;
    column2.classList.add("count-text");
    count.append(head);
    count.append(column1);
    count.append(column2);
};

const showChart = (e) => {
    const month = select.value;
    const filterdMonthArr = filterdByMonth(Number(month));

    const data = getData(filterdMonthArr);
    const dayArr = getDay(filterdMonthArr);

    if (dayArr.length === 0) {
        count.innerHTML = "";
        chart.innerHTML = "";
        return alert("운동 좀 하자");
    }

    const chartOption = configOption(data, dayArr);

    paintChart(chartOption, chart);

    paintResult(data, month);
};

const init = () => {
    createOtions();
    if (localStorage.getItem("workout")) {
        select.addEventListener("change", showChart);
        showChart();
    }
};

init();
