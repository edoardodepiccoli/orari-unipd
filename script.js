const corsApiHost = "https://corsproxy.io/?";
// const corsApiHost = "https://cors-anywhere.herokuapp.com/";
const url =
  corsApiHost + "https://agendastudentiunipd.easystaff.it/grid_call.php";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  Cookie:
    "PHPSESSID=mk8p28punm6rjtl8qcifqe1216; AWSALB=1iJIpDRvxYItABbqYJByLaiK7z0RaQhtriasFwD+S6n7EotmN2LhBsURkgn+20WgB8UuIICFlYNlRgWE0fg0eVyrngJWLl92pTPsy34ZKOE/w79oMkWfz2FQXIad; AWSALBCORS=1iJIpDRvxYItABbqYJByLaiK7z0RaQhtriasFwD+S6n7EotmN2LhBsURkgn+20WgB8UuIICFlYNlRgWE0fg0eVyrngJWLl92pTPsy34ZKOE/w79oMkWfz2FQXIad",
  Referer:
    "https://agendastudentiunipd.easystaff.it/index.php?view=easycourse&form-type=attivita&include=attivita&anno=2024&attivita%5B%5D=EC767924&attivita%5B%5D=EC767927&attivita%5B%5D=EC767928&attivita%5B%5D=EC767934&attivita%5B%5D=EC767935&visualizzazione_orario=cal&periodo_didattico=&date=07-11-2024&_lang=it&list=1&week_grid_type=-1&ar_codes_=&ar_select_=&col_cells=0&empty_box=0&only_grid=0&highlighted_date=0&all_events=0&faculty_group=0",
};

const body =
  "view=easycourse&form-type=attivita&include=attivita&anno=2024&attivita%5B%5D=EC767924&attivita%5B%5D=EC767927&attivita%5B%5D=EC767928&attivita%5B%5D=EC767934&attivita%5B%5D=EC767935&visualizzazione_orario=cal&periodo_didattico=&date=07-11-2024&_lang=it&list=1&week_grid_type=-1&ar_codes_=&ar_select_=&col_cells=0&empty_box=0&only_grid=0&highlighted_date=0&all_events=0&faculty_group=0&all_events=1";

function convertiData(data) {
  const giorno = data.slice(0, 2);
}

function formatDate(date) {
  const day = date.slice(0, 2);
  const month = date.slice(3, 5);
  const year = date.slice(6);

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

async function main() {
  try {
    const response = await sendRequest(url, headers, body);
    console.log("got response!");

    let lessons = [];

    response.celle.forEach((entry) => {
      const lesson = {
        italianDate: entry.data,
        date: formatDate(entry.data),
        fullDate: entry.GiornoCompleto,
        schedule: {
          start: entry.ora_inizio,
          end: entry.ora_fine,
        },
        info: {
          course: entry.nome_insegnamento,
          room: entry.aula,
        },
      };

      lessons.push(lesson);
    });

    lessons = lessons.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }

      if (a.schedule.start < b.schedule.start) {
        return -1;
      }
      if (a.schedule.start > b.schedule.start) {
        return 1;
      }
      return 0;
    });

    let days = {};

    lessons.forEach((entry) => {
      if (!days[entry.fullDate]) {
        days[entry.fullDate] = [];
      }
      days[entry.fullDate].push(entry);
    });

    const currentDate = new Date();
    formattedCurrentDate = currentDate.toISOString().slice(0, 10);

    const daysContainer = document.querySelector(".days-container");

    for (let day in days) {
      const newDayLessonsContainer = document.createElement("div");
      newDayLessonsContainer.classList.add("day-lessons-container");
      newDayLessonsContainer.innerText = day;

      for (let lesson of days[day]) {
        const newLessonContainer = document.createElement("div");
        newLessonContainer.classList.add("lesson-container");

        const courseSchedule = document.createElement("p");
        courseSchedule.classList.add("course-schedule");
        courseSchedule.innerText = `${lesson.schedule.start}-${lesson.schedule.end}`;

        const courseName = document.createElement("p");
        courseName.classList.add("course-name");
        courseName.innerText = lesson.info.course;

        const courseRoom = document.createElement("p");
        courseRoom.classList.add("course-room");
        courseRoom.innerText = lesson.info.room;

        newLessonContainer.appendChild(courseSchedule);
        newLessonContainer.appendChild(courseName);
        newLessonContainer.appendChild(courseRoom);

        newDayLessonsContainer.appendChild(newLessonContainer);
      }

      if (days[day][0].date === formattedCurrentDate) {
        newDayLessonsContainer.id = "current-date";

        const currentDateReminder = document.querySelector(
          ".current-date-reminder"
        );
        currentDateReminder.innerText = `Data odierna: ${day}`;
      }

      daysContainer.appendChild(newDayLessonsContainer);
    }

    const element = document.querySelector("#current-date");

    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY - 200;
    window.scrollTo({ top: elementPosition, behavior: "smooth" });
  } catch (error) {
    console.error("Error during request:", error);
  }
}

async function sendRequest(url, headers, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

main();
