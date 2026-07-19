/*
 * "Our Work" — GSAP infinite card slider.
 *
 * Faithful port of Cassie Evans' GSAP demo (codepen.io/GreenSock/pen/RwKwLWK):
 * a seamless looping timeline where cards travel in an arc, scrubbed by scroll,
 * with snapping, prev/next buttons, and drag support.
 *
 * One deliberate change for embedding on a real page: the original wraps the
 * SCROLL position itself so the page loops forever (you can never scroll past
 * it). Here the section is pinned for a bounded distance and scrubs exactly one
 * full loop, then releases — so a visitor can continue to the rest of the site.
 * The card loop still looks infinite while pinned, and dragging loops freely.
 */
(function () {
  function initOurWorkSlider() {
    if (!window.gsap || !window.ScrollTrigger || !window.Draggable) return;

    const slider = document.querySelector('#ourwork-slider');
    if (!slider) return;
    const cards = gsap.utils.toArray('#ourwork-slider .ourwork-cards li');
    if (!cards.length) return;

    gsap.registerPlugin(ScrollTrigger, Draggable);

    // Set initial state of items.
    gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

    const spacing = 0.1,                    // stagger between cards
      snap = gsap.utils.snap(spacing),      // snaps the playhead to a card
      animateFunc = (element) => {
        const tl = gsap.timeline();
        tl.fromTo(
          element,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.in', immediateRender: false }
        ).fromTo(
          element,
          { xPercent: 400 },
          { xPercent: -400, duration: 1, ease: 'none', immediateRender: false },
          0
        );
        return tl;
      },
      seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
      loopDuration = seamlessLoop.duration(),
      wrapTime = gsap.utils.wrap(0, loopDuration),
      playhead = { offset: 0 },
      // Reuse this tween to smoothly scrub the playhead on the seamlessLoop.
      scrub = gsap.to(playhead, {
        offset: 0,
        onUpdate() {
          seamlessLoop.time(wrapTime(playhead.offset));
        },
        duration: 0.5,
        ease: 'power3',
        paused: true,
      });

    // Bounded pin: scrub one full loop across this scroll distance, then release.
    const SCROLL_DISTANCE = 3000;
    const trigger = ScrollTrigger.create({
      trigger: '#ourwork-slider .ourwork-gallery',
      start: 'top top',
      end: '+=' + SCROLL_DISTANCE,
      pin: '#ourwork-slider .ourwork-gallery',
      anticipatePin: 1,
      onUpdate(self) {
        scrub.vars.offset = self.progress * loopDuration;
        scrub.invalidate().restart(); // reuse the tween for performance
      },
    });

    // Map a loop offset to an absolute scroll position within the pinned range.
    function offsetToScroll(offset) {
      const progress = gsap.utils.clamp(0, 1, offset / loopDuration);
      return trigger.start + progress * (trigger.end - trigger.start);
    }

    // Move the scroll playhead to the card nearest the given offset.
    // The site uses CSS `scroll-behavior: smooth`, which would animate (and
    // fight ScrollTrigger) on these programmatic jumps — so disable it just for
    // the jump and restore it, leaving anchor-nav smoothness untouched.
    const rootEl = document.documentElement;
    function scrollToOffset(offset) {
      const snapped = gsap.utils.clamp(0, loopDuration, snap(offset));
      const prevBehavior = rootEl.style.scrollBehavior;
      rootEl.style.scrollBehavior = 'auto';
      trigger.scroll(offsetToScroll(snapped));
      requestAnimationFrame(() => { rootEl.style.scrollBehavior = prevBehavior; });
    }

    // Snap to the closest card when scrolling stops (only while pinned).
    ScrollTrigger.addEventListener('scrollEnd', () => {
      if (trigger.isActive) scrollToOffset(scrub.vars.offset);
    });

    slider.querySelector('.ourwork-next').addEventListener('click', () => scrollToOffset(scrub.vars.offset + spacing));
    slider.querySelector('.ourwork-prev').addEventListener('click', () => scrollToOffset(scrub.vars.offset - spacing));

    // Dragging (mobile-friendly): free-scrub the deck, then snap on release.
    Draggable.create('#ourwork-slider .ourwork-drag-proxy', {
      type: 'x',
      trigger: '#ourwork-slider .ourwork-cards',
      onPress() {
        this.startOffset = scrub.vars.offset;
      },
      onDrag() {
        scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
        scrub.invalidate().restart();
      },
      onDragEnd() {
        scrollToOffset(scrub.vars.offset);
      },
    });

    // Prime the first frame so an arc of cards is visible before any scroll.
    seamlessLoop.time(wrapTime(0));

    function buildSeamlessLoop(items, spacing, animateFunc) {
      let overlap = Math.ceil(1 / spacing),                     // extra animations on each side for the seamless wrap
        startTime = items.length * spacing + 0.5,               // where the seamless loop starts on the rawSequence
        loopTime = (items.length + overlap) * spacing + 1,      // where it loops back to startTime
        rawSequence = gsap.timeline({ paused: true }),          // where all the "real" animations live
        seamlessLoop = gsap.timeline({                          // scrubs the rawSequence playhead so it appears to seamlessly loop
          paused: true,
          repeat: -1,
          onRepeat() {                                          // works around a rare edge-case bug
            this._time === this._dur && (this._tTime += this._dur - 0.01);
          },
        }),
        l = items.length + overlap * 2,
        time, i, index;

      for (i = 0; i < l; i++) {
        index = i % items.length;
        time = i * spacing;
        rawSequence.add(animateFunc(items[index]), time);
        i <= items.length && seamlessLoop.add('label' + i, time);
      }

      rawSequence.time(startTime);
      seamlessLoop
        .to(rawSequence, { time: loopTime, duration: loopTime - startTime, ease: 'none' })
        .fromTo(
          rawSequence,
          { time: overlap * spacing + 1 },
          { time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: 'none' }
        );
      return seamlessLoop;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOurWorkSlider);
  } else {
    initOurWorkSlider();
  }
})();
