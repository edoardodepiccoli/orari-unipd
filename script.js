const url = "https://agendastudentiunipd.easystaff.it/grid_call.php";

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

async function main() {
  try {
    const response = await sendRequest(url, headers, body);
    celle = response.celle;

    // console.log(celle);

    const lezioni = [];

    celle.forEach((entry) => {
      // console.log(
      //   `${entry.nome_insegnamento} / ${entry.GiornoCompleto} - ${entry.orario} / ${entry.aula}\n`
      // );

      const lezione = {
        data: entry.data,
        orario: {
          oraInizio: entry.ora_inizio,
          oraFine: entry.ora_fine,
        },
        dettagli: {
          nomeInsegnamento: entry.nome_insegnamento,
          giornoCompleto: entry.GiornoCompleto,
          aula: entry.aula,
        },
      };

      lezioni.push(lezione);
    });

    console.log(lezioni);
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
