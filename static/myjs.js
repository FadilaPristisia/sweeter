function post() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            date_give: today
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            alert("An error occurred while posting your comment.");
        }
    })
  }

function time2str(date) {
    let today = new Date();
    let time = (today-date)/1000/60; 

    if (time < 60) {
      return parseInt(time) + " minutes ago";
    }
    time = time / 60; 
    if (time < 24) {
      return parseInt(time) + " hours ago";
    }
    time = time / 24; 
    if (time < 7) {
      return parseInt(time) + " days ago";
    }
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}.${month}.${day}`;
  }

function num2str(count) {
      if (count > 10000) {
        return parseInt(count /  1000) + 'k';
      }
      if (count > 500) {
        return parseInt(count /  100) / 10 + 'k';
      }
      if (count == 0) {
        return '';
      }
      return count;
    }

function get_posts(username) { 
  if (username == undefined) {
    username = "";
  }
    $("#post-box").empty();
        $.ajax({
          type: "GET",
          url: `/get_posts?username_give=${username}`,
          data: {},
          success: function (response) {
            if (response["result"] === "success") {
              let posts = response["posts"];
              for (let i = 0; i < posts.length; i++) {
                let post = posts[i];
                let time_post = new Date(post["date"]);
                let time_before = time2str(time_post);
                let class_heart = post["heart_by_me"] ? "fa-heart" : "fa-heart-o";
                let class_star = post["star_by_me"] ? "fa-star" : "fa-star-o";
                let class_thumbsup = post["thumbsup_by_me"] ? "fa-thumbs-up" : "fa-thumbs-o-up";
                let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post["username"]}">
                                                    <img class="is-rounded" src="/static/${post["profile_pic_real"]}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>${post["profile_name"]}</strong> 
                                                        <small>@${post["username"]}</small> 
                                                        <small>${time_before}</small>
                                                        <br>
                                                        ${post["comment"]}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" 
                                                          onclick="toggle_like('${post["_id"]}', 'heart')">
                                                          <span class="icon is-small">
                                                          <i class="fa ${class_heart}"aria-hidden="true"></i>
                                                          </span>&nbsp;<span class="like-num">${num2str(post['count_heart'])}</span>
                                                        </a>

                                                        <a class="level-item is-sparta" aria-label="star" 
                                                          onclick="toggle_star('${post["_id"]}', 'star')">
                                                          <span class="icon is-small">
                                                          <i class="fa ${class_star}"aria-hidden="true"></i>
                                                          </span>&nbsp;<span class="like-num">${num2str(post['count_star'])}</span>
                                                        </a>

                                                        <a class="level-item is-sparta" aria-label="thumbsup" 
                                                          onclick="toggle_thumbsup('${post["_id"]}', 'thumbsup')">
                                                          <span class="icon is-small">
                                                          <i class="fa ${class_thumbsup}"aria-hidden="true"></i>
                                                          </span>&nbsp;<span class="like-num">${num2str(post['count_thumbsup'])}</span>
                                                        </a>
                                                    </div>

                                                </nav>
                                            </div>
                                        </article>
                                    </div>`;
                $("#post-box").append(html_temp);
              }
            }
          },
        });
      }

function toggle_like(post_id, type) {
    let $a_like = $(`#${post_id} a[aria-label='heart']`);
    let $i_like = $a_like.find("i");
    $.ajax({
        type: "POST",
        url: "/update_like",
        data: {
            post_id_give: post_id,
            type_give: type,
            action_give: $i_like.hasClass("fa-heart") ? "unlike" : "like", // Tentukan aksi berdasarkan apakah pengguna telah menyukai posting ini sebelumnya
        },
        success: function (response) {
            if (response["result"] === "success") {
                $i_like.toggleClass("fa-heart fa-heart-o"); // Ubah ikon hati sesuai dengan aksi yang dilakukan
                $a_like.find("span.like-num").text(num2str(response["count"])); // Perbarui jumlah like
            }
        },
    });
}

function toggle_star(post_id, type) {
  let $a_like = $(`#${post_id} a[aria-label='star']`);
  let $i_like = $a_like.find("i");
  $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
          post_id_give: post_id,
          type_give: type,
          action_give: $i_like.hasClass("fa-star") ? "unlike" : "like", // Tentukan aksi berdasarkan apakah pengguna telah menyukai posting ini sebelumnya
      },
      success: function (response) {
          if (response["result"] === "success") {
              $i_like.toggleClass("fa-star fa-star-o"); // Ubah ikon hati sesuai dengan aksi yang dilakukan
              $a_like.find("span.like-num").text(num2str(response["count"])); // Perbarui jumlah like
          }
      },
  });
}

function toggle_thumbsup(post_id, type) {
  let $a_like = $(`#${post_id} a[aria-label='thumbsup']`);
  let $i_like = $a_like.find("i");
  $.ajax({
      type: "POST",
      url: "/update_like",
      data: {
          post_id_give: post_id,
          type_give: type,
          action_give: $i_like.hasClass("fa-thumbs-up") ? "unlike" : "like", // Tentukan aksi berdasarkan apakah pengguna telah menyukai posting ini sebelumnya
      },
      success: function (response) {
          if (response["result"] === "success") {
              $i_like.toggleClass("fa-thumbs-up fa-thumbs-o-up"); // Ubah ikon hati sesuai dengan aksi yang dilakukan
              $a_like.find("span.like-num").text(num2str(response["count"])); // Perbarui jumlah like
          }
      },
  });
}

// Untuk logout, anda hanya tinggal
// menghapus token anda dari cookies browser anda
function logout() {
    $.removeCookie("mytoken");
    alert("You have been logged out!");
    window.location.href = "/login";
    }
    