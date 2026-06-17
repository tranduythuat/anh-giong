if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// Kích hoạt ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Gọi các hiệu ứng có sẵn
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0); 
  
  // Nếu URL có ?opened=1 thì bỏ qua page1, hiển thị page2 luôn (không bị nhảy về bì thư khi reload)
  const getParams = new URLSearchParams(window.location.search);
  if (getParams.get("opened") === "1") {
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    page1.classList.add('hidden');
    page2.classList.add('show');
    gsap.set('#page2', { opacity: 1 });
    document.body.style.overflow = "auto";
  }

  gsapFlipIn(".animate-flip");
  gsapFadeIn(".fade-in");
  gsapFadeRight(".fade-right");
  gsapFadeLeft(".fade-left");
  gsapFadeUp(".fade-up");
  gsapFadeDown(".fade-down");
  gsapRotateBottomLeft(".rotate-bl");
  gsapRotateBottomRight(".rotate-br");
  gsapFlipVerticalLeft(".flip-vertical-left");
  gsapRollInLeft(".roll-in-left");
  gsap_rotate_bl__float(".rotate-bl--float");

  // Tạo timeline
  const tl_custom = gsap.timeline({
    repeatDelay: 0,  // delay giữa các lần lặp
    defaults: { duration: .8, ease: "power2.out" }, // giá trị mặc định
    scrollTrigger: {
      trigger: ".timeline-items",
      start: "top 90%", // khi phần tử xuất hiện 80% trong viewport
    }
  });

  // Thêm các animation theo thứ tự
  tl_custom.from(".tl-item-1", { x: -100, opacity: 0 })        // box đỏ bay xuống
    .from(".tl-item-2", { x: -100, opacity: 0 }, "-=0.3")       // box xanh bay từ trái
    .from(".tl-item-3", { x: -100, opacity: 0 }, "-=0.3");    // box xanh lá phóng to dần

  const tl_dresscode = gsap.timeline({
    repeatDelay: 0,  // delay giữa các lần lặp
    defaults: { duration: .8, ease: "power2.out" }, // giá trị mặc định
    scrollTrigger: {
      trigger: ".color-palette",
      start: "top 90%", // khi phần tử xuất hiện 80% trong viewport
    }
  });

  // Thêm các animation theo thứ tự
  tl_dresscode.from(".white", { x: -100, opacity: 0 })        // box đỏ bay xuống
    .from(".circle1", { x: -100, opacity: 0 }, "-=0.3")       // box xanh bay từ trái
    .from(".circle2", { x: -100, opacity: 0 }, "-=0.3")       // box xanh bay từ trái
    .from(".circle3", { x: -100, opacity: 0 }, "-=0.3")       // box xanh bay từ trái
    .from(".circle4", { x: -100, opacity: 0 }, "-=0.3")       // box xanh bay từ trái
    .from(".circle5", { x: -100, opacity: 0 }, "-=0.3")       // box xanh bay từ trái

  if (getParams.get("opened") === "1") {
    initScrollAnimations();
    ScrollTrigger.refresh();
  }

  const envelope = document.getElementById('envelope');
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');

  // Animation mở thư
  envelope.addEventListener('click', function () {
    const tl = gsap.timeline({
      onComplete: () => {
        page1.classList.add('hidden');
        page2.classList.add('show');

        const url = new URL(window.location.href);
        url.searchParams.set('opened', '1');
        history.replaceState(null, '', url);
        
        // Fade in page 2
        gsap.to('#page2', {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            playMusic();
            document.body.style.overflow = "auto";
            // Nếu dùng ScrollTrigger → refresh lại
            ScrollTrigger.refresh();
          }
        });
        // Khởi tạo ScrollTrigger animations
        initScrollAnimations();
      }
    });

    // Animation mở envelope
    tl.to('.envelope-flap', {
      y: -160,
      transformOrigin: 'top center',
      duration: 1.5,
      ease: 'power2.inOut'
    })
      .to('.envelope', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, '+=0.3')
      .to('#page1', {
        opacity: 0,
        duration: 0.3
      });
  });

  function initScrollAnimations() {
    // const sections = document.querySelectorAll('.scroll-section');

    gsap.utils.toArray('.scroll-section').forEach(() => {
      gsapFlipIn(".animate-flip");
      gsapFadeIn(".animate-fade");
      gsapFadeRight(".fade-right");
      gsapFadeLeft(".fade-left");
      gsapFadeUp(".fade-up");
      gsapFadeDown(".fade-down");
      gsapRotateBottomLeft(".rotate-bl");
      gsapRotateBottomRight(".rotate-br");
      gsapFlipVerticalLeft(".flip-vertical-left");
      gsapRollInLeft(".roll-in-left");
      gsap_rotate_bl__float(".rotate-bl--float");
    });

    // sections.forEach((section, index) => {
    // });
  }

  async function playMusic(e) {
    const music = document.getElementById('audio');
    if (!music.src) {
        alert('Chưa có nhạc, vui lòng thêm src cho audio.');
        return;
    }
    if (music.paused) {
      music.play();
    } 
    music.addEventListener('play', () => {
        iconSvg.classList.add('spin');
    });
  }

  async function toggleMusic(e) {
    const audio = document.getElementById('audio');
    const iconSvg = document.getElementById('iconSvg');
    if (!audio.src) {
        alert('Chưa có nhạc, vui lòng thêm src cho audio.');
        return;
    }
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }

    audio.addEventListener('play', () => {
        iconSvg.classList.add('spin');
    });
    audio.addEventListener('pause', () => {
        iconSvg.classList.remove('spin');
    });
  }

  const btn = document.getElementById('player-btn');
  btn.addEventListener('click', toggleMusic);

  const form = document.forms["rsvpForm"];
  if (form) {
    form.addEventListener("submit", (e) => handleFormSubmit(e));
  }
});

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log("🚀 ~ handleFormSubmit ~ data:", data);

  const {
    name: name,
    confirm: confirm,
    attendance: attendance,
    dietary: dietary,
    other: other,
    wish: wish,
  } = data;
  console.log("🚀 ~ handleFormSubmit 2~ data:", data);

  // Thông báo khi bắt đầu gửi
  Swal.fire({
    title: 'Đang gửi ...',
    text: "Vui lòng chờ trong giây lát",
    icon: "info",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const url = "/exec?sheet=confirm";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name,
        confirm,
        attendance,
        dietary,
        other,
        wish
      }),
    });

    const result = await res.json().catch(() => ({}));
    console.log("Server response:", result);

    form.reset();

    // Thông báo thành công
    Swal.fire({
      title: "Thành công!",
      text: "Cảm ơn bạn đã gửi phản hồi, thông tin đã được gửi đến dâu rể rồi nha",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#000",
    });
  } catch (error) {
    console.error("Error:", error);

    // Thông báo lỗi
    Swal.fire({
      title: "Lỗi!",
      text: "OPPS! Đã xảy ra lỗi: " + error.message,
      icon: "error",
      confirmButtonText: "Thử lại",
      confirmButtonColor: "#000",
    });
  }
}
