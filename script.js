// Kun sivu on ladattu
$(document).ready(function() {
  let tehtavat = [];

  // Haetaan esimerkkitehtäviä ulkoisesta API:sta Axiosilla
  axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then(response => {
      tehtavat = response.data.map(t => ({ teksti: t.title, valmis: t.completed }));
      piirraTehtavat();
    })
    .catch(error => {
      console.error("Virhe haettaessa tehtäviä:", error);
    });

  // Päivittää laskurin ja progress barin
  function paivitaLaskuri() {
    const jaljella = tehtavat.filter(t => !t.valmis).length;
    const tehty = tehtavat.length - jaljella;
    const prosentti = tehtavat.length > 0 ? Math.round((tehty / tehtavat.length) * 100) : 0;

    // Päivitä laskuri
    $("#counter").fadeOut(150, function() {
      $(this).text(`Tehtäviä jäljellä: ${jaljella}`).fadeIn(150);
    });

    // Päivitä progress bar
    $("#progress-bar").css("width", prosentti + "%").text(prosentti + "%");

    // Konfetti kun kaikki tehtävät tehty
    if (jaljella === 0 && tehtavat.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // Piirtää tehtävät listalle
  function piirraTehtavat() {
    $("#todo-list").html("");
    tehtavat.forEach((tehtava, indeksi) => {
      const valmisLuokka = tehtava.valmis ? "done list-group-item-secondary" : "list-group-item-light";
      const $li = $(`
        <li class="list-group-item d-flex justify-content-between align-items-start ${valmisLuokka}">
          <span class="tehtava-teksti">${tehtava.teksti}</span>
          <div>
            <button class="btn btn-success btn-sm merkitse" data-index="${indeksi}">✓</button>
            <button class="btn btn-danger btn-sm poista" data-index="${indeksi}">x</button>
          </div>
        </li>
      `);
      $li.hide().appendTo("#todo-list").fadeIn(300);
    });
    paivitaLaskuri();
  }

  // Lomakkeen lähetys
  $("#todo-form").on("submit", function(e) {
    e.preventDefault();
    const teksti = $("#todo-input").val().trim();

    if (teksti.length < 3) {
      $("#todo-input").addClass("error");
      $("#error-message").hide().text("Tehtävän pitää olla vähintään 3 merkkiä.").fadeIn(300);
      return;
    }

    $("#todo-input").removeClass("error");
    $("#error-message").fadeOut(200);

    tehtavat.push({ teksti, valmis: false });
    piirraTehtavat();
    $("#todo-input").val("");
  });

  // Tehtävän merkintä valmiiksi
  $("#todo-list").on("click", ".merkitse", function() {
    const i = $(this).data("index");
    tehtavat[i].valmis = !tehtavat[i].valmis;
    $(this).closest("li").fadeOut(200, function() {
      piirraTehtavat();
    });
  });

  // Tehtävän poisto
  $("#todo-list").on("click", ".poista", function() {
    const i = $(this).data("index");
    $(this).closest("li").fadeOut(300, function() {
      tehtavat.splice(i, 1);
      piirraTehtavat();
    });
  });
});
