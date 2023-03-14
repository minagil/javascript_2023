import Swiper, { Navigation, Autoplay, Pagination } from "swiper";

function handlerInert(swiper) {
	const $currSlide = $(swiper.slides[swiper.activeIndex]);

	$currSlide.find("a").removeAttr("tabindex").attr({ "aria-hidden": "false" });
	$currSlide
		.siblings()
		.find("a")
		.attr({ tabindex: "-1", "aria-hidden": "true" });
}

// function notifyMessage(swiper) {
// 	const $region = $(swiper.el).find(".swiper-message");
// 	const $message = $(swiper.slides[swiper.activeIndex]).clone();
// 	const totalSlidesCount = swiper.slides.filter(
// 		(el) => !el.classList.contains("swiper-slide-duplicate")
// 	).length;

// 	$region
// 		.empty()
// 		.append(
// 			$message.find("a").children(),
// 			`총 ${totalSlidesCount}개 중 ${swiper.realIndex + 1}번째 슬라이드`
// 		);
// }

function toggleAutoplayState(event) {
	const $control = $(event.target);
	const $notifyEl = $(this.el).find(".swiper-message");

	if (this.autoplay.running) {
		$control.text(`자동 넘김 시작`);
		$notifyEl.attr(`aria-live`, `polite`);
		this.autoplay.stop();
	} else {
		$control.text(`자동 넘김 일시 정지`);
		$notifyEl.removeAttr(`aria-live`);
		this.autoplay.start();
	}
}

const swiper = new Swiper(`.swiper`, {
	direction: `horizontal`,
	loop: true,
	modules: [Navigation, Autoplay, Pagination],
	autoplay: true,
	navigation: {
		prevEl: `.swiper-controller--prev`,
		nextEl: `.swiper-controller--next`,
	},
	pagination: {
		el: `.swiper-pagination`,
		type: `bullets`,
		clickable: true,
		renderBullet: function (idx, className) {
			return `
      <button type="button" class="${className}"
      aria-labelledby="slide${idx + 1}"
      role="tab"
      aria-selected="${idx === this.realIndex}"
      ></button>`;
		},
	},
	on: {
		init() {
			const $control = $(this.el).find(`.swiper-controller--autoplay`);
			$control.on(`click`, toggleAutoplayState.bind(this)).click();
		},
		slideChange() {
			handlerInert(this);
			// notifyMessage(this);
		},
		paginationUpdate(swiper, el) {
			for (let i = -1, bullet; bullet = swiper.pagination.bullets[++i]; ) {
				bullet.setAttribute(
					`aria-selected`,
					(swiper.realIndex === i).toString()
				);
			}
		},
	},
});
