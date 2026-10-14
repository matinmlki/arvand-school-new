/* =========================================================
   Arvand School 1
   Main JavaScript
   ========================================================= */

   document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM Elements
       ===================================================== */

    const body = document.body;

    const navigation = document.querySelector(".main-navigation");
    const navigationLinks = navigation
        ? navigation.querySelectorAll("a[href^='#']")
        : [];

    const mobileMenuButton = document.querySelector(".mobile-menu-button");

    const sections = document.querySelectorAll(
        "main section[id]"
    );


    /* =====================================================
       Scroll Lock
       ===================================================== */
    /* =====================================================
   Scroll Lock
   ===================================================== */

let scrollPosition = 0;

function lockScroll() {
    scrollPosition = window.scrollY;

    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
}

function unlockScroll() {
    const savedPosition = scrollPosition;

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";

    // برگرداندن صفحه دقیقاً به همان نقطه قبل از باز شدن Modal
    window.scrollTo({
        top: savedPosition,
        left: 0,
        behavior: "instant"
    });
}
   
    

    /* =====================================================
       Mobile Navigation
       ===================================================== */

    function openMobileMenu() {

        if (!navigation || !mobileMenuButton) {
            return;
        }

        navigation.classList.add("menu-open");
        mobileMenuButton.setAttribute("aria-expanded", "true");
        mobileMenuButton.setAttribute(
            "aria-label",
            "بستن منو"
        );
    }


    function closeMobileMenu() {

        if (!navigation || !mobileMenuButton) {
            return;
        }

        navigation.classList.remove("menu-open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.setAttribute(
            "aria-label",
            "باز کردن منو"
        );
    }


    function toggleMobileMenu() {

        if (!navigation) {
            return;
        }

        const isOpen = navigation.classList.contains("menu-open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }


    if (mobileMenuButton) {
        mobileMenuButton.addEventListener(
            "click",
            toggleMobileMenu
        );
    }


    /* =====================================================
       Navigation
       ===================================================== */

    function setActiveNavigation(targetId) {

        if (!navigationLinks.length) {
            return;
        }

        navigationLinks.forEach(link => {

            const linkTarget =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                linkTarget === `#${targetId}`
            );

        });
    }


    function scrollToSection(section) {

        if (!section) {
            return;
        }

        const header = document.querySelector(".site-header");

        const headerHeight =
            header ? header.offsetHeight : 0;

        const sectionTop =
            section.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;

        window.scrollTo({
            top: Math.max(sectionTop, 0),
            behavior: "smooth"
        });
    }


    navigationLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetSection =
                document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            setActiveNavigation(
                targetSection.id
            );

            scrollToSection(targetSection);

            closeMobileMenu();
        });

    });


    /* =====================================================
       Footer / Other Internal Links
       ===================================================== */

    document
        .querySelectorAll("a[href^='#']")
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#" ||
                    link.closest(".main-navigation")
                ) {
                    return;
                }

                const targetSection =
                    document.querySelector(targetId);

                if (!targetSection) {
                    return;
                }

                event.preventDefault();

                scrollToSection(targetSection);

            });

        });


    /* =====================================================
       Active Navigation On Scroll
       ===================================================== */

    if (sections.length) {

        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    const visibleSections =
                        entries
                            .filter(entry => entry.isIntersecting)
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (!visibleSections.length) {
                        return;
                    }

                    setActiveNavigation(
                        visibleSections[0].target.id
                    );

                },
                {
                    root: null,
                    rootMargin: "-20% 0px -60% 0px",
                    threshold: [0.1, 0.25, 0.5]
                }
            );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* =====================================================
       Close Mobile Menu On Resize
       ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {
            closeMobileMenu();
        }

    });


    /* =====================================================
       Generic Modal Helpers
       ===================================================== */

    function openModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        lockScroll();
    }


    function closeModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        unlockScroll();
    }


    function setupModalClose(modal, closeButton) {

        if (!modal) {
            return;
        }

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                () => closeModal(modal)
            );
        }

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeModal(modal);
            }

        });

    }


    /* =====================================================
       Escape Key
       ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") {
            return;
        }

        const activeModal =
            document.querySelector(
                ".news-modal.active, .gallery-modal.active, .teachers-modal.active, .founder-modal.active, .profile-modal.active"
            );

        if (activeModal) {
            closeModal(activeModal);
            return;
        }

        closeMobileMenu();

    });


    /* =====================================================
       Achievements
       ===================================================== */

    const achievementYear =
        document.querySelector("#achievement-year");

    const achievementContent =
        document.querySelector("#achievement-content");

    const achievementCards =
        document.querySelectorAll(".achievement-card");


    function updateAchievements() {

        if (!achievementYear) {
            return;
        }

        const selectedYear =
            achievementYear.value;


        /*
         * هر کارت باید در نسخه نهایی HTML دارای
         * data-year باشد.
         *
         * مثال:
         *
         * data-year="1405-1406"
         *
         * یا:
         *
         * data-year="1404-1405"
         *
         * کارت‌هایی که data-year ندارند فعلاً
         * برای جلوگیری از نمایش اشتباه مخفی می‌شوند.
         */

        let visibleCount = 0;

        achievementCards.forEach(card => {

            const cardYear =
                card.dataset.year;

            const matches =
                cardYear === selectedYear;

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }

        });


        if (achievementContent) {

            if (visibleCount > 0) {

                achievementContent.innerHTML =
                    `<p>افتخارات سال تحصیلی ${achievementYear.options[achievementYear.selectedIndex].text}:</p>`;

            } else {

                achievementContent.innerHTML =
                    `<p>برای این سال تحصیلی هنوز افتخاری ثبت نشده است.</p>`;

            }

        }

    }


    if (achievementYear) {

        achievementYear.addEventListener(
            "change",
            updateAchievements
        );

        updateAchievements();

    }


    /* =====================================================
       Achievement Modal
       ===================================================== */

    /*
     * در HTML فعلی Modal افتخارات وجود ندارد.
     *
     * بنابراین فعلاً فقط رفتار کلی کارت‌ها تعریف می‌شود.
     * بعد از اضافه شدن ساختار Modal، همین منطق می‌تواند
     * اطلاعات کارت انتخاب‌شده را داخل آن قرار دهد.
     */

    achievementCards.forEach(card => {

        card.addEventListener("click", () => {

            const title =
                card.querySelector("h3");

            const description =
                card.querySelector("p");

            if (!title || !description) {
                return;
            }

            /*
             * Modal افتخارات باید در HTML اضافه شود.
             * عمداً اینجا Modal ساختگی ایجاد نمی‌کنیم،
             * چون ظاهر و ساختار آن باید با طراحی فعلی
             * هماهنگ باشد.
             */

        });

    });


    /* =====================================================
       News
       ===================================================== */

    const newsCards =
        document.querySelectorAll(".news-card");

    const newsModal =
        document.querySelector("#newsModal");

    const newsModalClose =
        document.querySelector(".news-modal-close");

    const newsModalPrev =
        document.querySelector(".news-modal-prev");

    const newsModalNext =
        document.querySelector(".news-modal-next");

    const modalNewsImage =
        document.querySelector("#modalNewsImage");

    const modalNewsCategory =
        document.querySelector("#modalNewsCategory");

    const modalNewsDate =
        document.querySelector("#modalNewsDate");

    const modalNewsTitle =
        document.querySelector("#modalNewsTitle");

    const modalNewsText =
        document.querySelector("#modalNewsText");


    let currentNewsIndex = 0;

    function getNewsData() {

        return Array.from(newsCards).map(card => {

            const image =
                card.querySelector(".news-image img");

            const category =
                card.querySelector(".news-category");

            const date =
                card.querySelector(".news-date");

            const title =
                card.querySelector(".news-content h3");

            const text =
                card.querySelector(".news-content p");

            const galleryImages =
                card.querySelectorAll(".news-gallery img");

            const gallery =
                Array.from(galleryImages).map(img => ({
                    src: img.src,
                    alt: img.alt
                }));

            return {
                element: card,
                image: image
                    ? image.src
                    : "",
                imageAlt: image
                    ? image.alt
                    : "",
                category: category
                    ? category.textContent.trim()
                    : "",
                date: date
                    ? date.textContent.trim()
                    : "",
                datetime: date
                    ? date.getAttribute("datetime") || ""
                    : "",
                title: title
                    ? title.textContent.trim()
                    : "",
                text: text
                    ? text.textContent.trim()
                    : "",
                gallery: gallery
            };

        });

    }
    function updateNewsModal() {

        const news =
            getNewsData();

        if (!news.length) {
            return;
        }

        const current =
            news[currentNewsIndex];

        if (modalNewsImage) {
            modalNewsImage.src =
                current.image;

            modalNewsImage.alt =
                current.imageAlt;
        }

        if (modalNewsCategory) {
            modalNewsCategory.textContent =
                current.category;
        }

        if (modalNewsDate) {
            modalNewsDate.textContent =
                current.date;

            modalNewsDate.setAttribute(
                "datetime",
                current.datetime
            );
        }

        if (modalNewsTitle) {
            modalNewsTitle.textContent =
                current.title;
        }

        if (modalNewsText) {
            modalNewsText.textContent =
                current.text;
        }

        /* گالری عکس‌ها */
        const modalNewsGallery =
            document.querySelector("#modalNewsGallery");

        if (modalNewsGallery) {

            modalNewsGallery.innerHTML = "";

            if (current.gallery && current.gallery.length) {

                current.gallery.forEach(img => {

                    const imgEl =
                        document.createElement("img");

                    imgEl.src = img.src;
                    imgEl.alt = img.alt;

                    modalNewsGallery.appendChild(imgEl);

                });

            }

        }

    }


      
    





    function openNews(index) {

        const news =
            getNewsData();

        if (!news.length || !newsModal) {
            return;
        }

        currentNewsIndex =
            Math.max(
                0,
                Math.min(index, news.length - 1)
            );

        updateNewsModal();

        openModal(newsModal);

    }


    function showPreviousNews() {

        const news =
            getNewsData();

        if (!news.length) {
            return;
        }

        currentNewsIndex =
            currentNewsIndex <= 0
                ? news.length - 1
                : currentNewsIndex - 1;

        updateNewsModal();

    }


    function showNextNews() {

        const news =
            getNewsData();

        if (!news.length) {
            return;
        }

        currentNewsIndex =
            currentNewsIndex >= news.length - 1
                ? 0
                : currentNewsIndex + 1;

        updateNewsModal();

    }


    newsCards.forEach((card, index) => {

        card.addEventListener(
            "click",
            () => openNews(index)
        );

    });
    


    if (newsModalClose) {
        newsModalClose.addEventListener(
            "click",
            () => closeModal(newsModal)
        );
    }


    if (newsModalPrev) {
        newsModalPrev.addEventListener(
            "click",
            showPreviousNews
        );
    }


    if (newsModalNext) {
        newsModalNext.addEventListener(
            "click",
            showNextNews
        );
    }


    setupModalClose(
        newsModal,
        null
    );


    /* =====================================================
       Gallery
       ===================================================== */

    const galleryItems =
        document.querySelectorAll(".gallery-item");

    const galleryModal =
        document.querySelector("#galleryModal");

    const galleryModalClose =
        document.querySelector(".gallery-modal-close");

    const galleryModalPrev =
        document.querySelector(".gallery-modal-prev");

    const galleryModalNext =
        document.querySelector(".gallery-modal-next");

    const modalGalleryImage =
        document.querySelector("#modalGalleryImage");


    let currentGalleryIndex = 0;


    function getGalleryData() {

        return Array.from(galleryItems).map(item => {

            const image =
                item.querySelector("img");

            return {
                image: image
                    ? image.src
                    : "",
                alt: image
                    ? image.alt
                    : ""
            };

        });

    }


    function updateGalleryModal() {

        const gallery =
            getGalleryData();

        if (
            !gallery.length ||
            !modalGalleryImage
        ) {
            return;
        }

        const current =
            gallery[currentGalleryIndex];

        modalGalleryImage.src =
            current.image;

        modalGalleryImage.alt =
            current.alt;

    }


    function openGallery(index) {

        const gallery =
            getGalleryData();

        if (!gallery.length || !galleryModal) {
            return;
        }

        currentGalleryIndex =
            Math.max(
                0,
                Math.min(index, gallery.length - 1)
            );

        updateGalleryModal();

        openModal(galleryModal);

    }


    function showPreviousGalleryImage() {

        const gallery =
            getGalleryData();

        if (!gallery.length) {
            return;
        }

        currentGalleryIndex =
            currentGalleryIndex <= 0
                ? gallery.length - 1
                : currentGalleryIndex - 1;

        updateGalleryModal();

    }


    function showNextGalleryImage() {

        const gallery =
            getGalleryData();

        if (!gallery.length) {
            return;
        }

        currentGalleryIndex =
            currentGalleryIndex >= gallery.length - 1
                ? 0
                : currentGalleryIndex + 1;

        updateGalleryModal();

    }


    galleryItems.forEach((item, index) => {

        item.addEventListener(
            "click",
            () => openGallery(index)
        );

    });


    if (galleryModalClose) {

        galleryModalClose.addEventListener(
            "click",
            () => closeModal(galleryModal)
        );

    }


    if (galleryModalPrev) {

        galleryModalPrev.addEventListener(
            "click",
            showPreviousGalleryImage
        );

    }


    if (galleryModalNext) {

        galleryModalNext.addEventListener(
            "click",
            showNextGalleryImage
        );

    }


    setupModalClose(
        galleryModal,
        null
    );


    /* =====================================================
       Keyboard Navigation
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const newsIsOpen =
                newsModal &&
                newsModal.classList.contains("active");

            const galleryIsOpen =
                galleryModal &&
                galleryModal.classList.contains("active");


            if (newsIsOpen) {

                if (event.key === "ArrowRight") {
                    showPreviousNews();
                }

                if (event.key === "ArrowLeft") {
                    showNextNews();
                }

            }


            if (galleryIsOpen) {

                if (event.key === "ArrowRight") {
                    showPreviousGalleryImage();
                }

                if (event.key === "ArrowLeft") {
                    showNextGalleryImage();
                }

            }

        }
    );
            /* =====================================================
       Teachers Modal
       ===================================================== */

    const subjectCards =
    document.querySelectorAll(".subject-card");

const teachersModal =
    document.querySelector("#teachersModal");

const teachersModalClose =
    document.querySelector(".teachers-modal-close");

const teachersModalTitle =
    document.querySelector("#teachersModalTitle");

const teachersModalGrid =
    document.querySelector("#teachersModalGrid");


function renderTeachers(teachersString) {

    if (!teachersModalGrid) {
        return;
    }

    teachersModalGrid.innerHTML = "";

    const names =
        teachersString
            .split("|")
            .map(name => name.trim())
            .filter(name => name.length > 0);

    if (!names.length) {

        const empty =
            document.createElement("p");
        empty.textContent = "دبیری برای این درس ثبت نشده است.";
        empty.style.width = "100%";
        empty.style.textAlign = "center";
        empty.style.color = "var(--text-light)";
        teachersModalGrid.appendChild(empty);
        return;

    }

    names.forEach((name, index) => {

        const card =
            document.createElement("article");
        card.className = "teacher-card";
        card.innerHTML = `
            <div class="teacher-image">
                <img
                    src="images/teacher-${(index % 4) + 1}.jpg"
                    alt="${name}"
                >
            </div>
            <div class="teacher-info">
                <h4>${name}</h4>
                <span>دبیر</span>
            </div>
        `;
        teachersModalGrid.appendChild(card);

    });

}


function openTeachersModal(title, teachers) {

    if (!teachersModal) {
        return;
    }

    if (teachersModalTitle && title) {
        teachersModalTitle.textContent = title;
    }

    renderTeachers(teachers);

    openModal(teachersModal);

}


subjectCards.forEach(card => {

    card.addEventListener("click", () => {

        const title =
            card.dataset.subjectTitle || "";

        const teachers =
            card.dataset.teachers || "";

        openTeachersModal(title, teachers);

    });

});


if (teachersModalClose) {

    teachersModalClose.addEventListener(
        "click",
        () => closeModal(teachersModal)
    );

}


setupModalClose(
    teachersModal,
    null
);
    /* =====================================================
       Founder Modal
       ===================================================== */

       const founderButtons =
       document.querySelectorAll(".founder-more-button");

   const founderModal =
       document.querySelector("#founderModal");

   const founderModalClose =
       document.querySelector(".founder-modal-close");

   const modalFounderImage =
       document.querySelector("#modalFounderImage");

   const modalFounderName =
       document.querySelector("#modalFounderName");

   const modalFounderRole =
       document.querySelector("#modalFounderRole");

   const modalFounderBio =
       document.querySelector("#modalFounderBio");


   function openFounderModal(button) {

       if (!button || !founderModal) {
           return;
       }

       const name = button.dataset.founderName || "";
       const role = button.dataset.founderRole || "";
       const bio = button.dataset.founderBio || "";
       const image = button.dataset.founderImage || "";

       if (modalFounderImage) {
           modalFounderImage.src = image;
           modalFounderImage.alt = name;
       }

       if (modalFounderName) {
           modalFounderName.textContent = name;
       }

       if (modalFounderRole) {
           modalFounderRole.textContent = role;
       }

       if (modalFounderBio) {
           modalFounderBio.textContent = bio;
       }

       openModal(founderModal);

   }


   founderButtons.forEach(button => {

       button.addEventListener("click", event => {

           event.stopPropagation();

           openFounderModal(button);

       });

   });


   if (founderModalClose) {

       founderModalClose.addEventListener(
           "click",
           () => closeModal(founderModal)
       );

   }


   setupModalClose(
       founderModal,
       null
   );
       /* =====================================================
       News Slider
       ===================================================== */

       const newsCardsContainer =
       document.querySelector(".news-cards");

   const newsSliderPrev =
       document.querySelector(".news-slider-prev");

   const newsSliderNext =
       document.querySelector(".news-slider-next");


   function scrollNews(direction) {

       if (!newsCardsContainer) {
           return;
       }

       const firstCard =
           newsCardsContainer.querySelector(".news-card");

       if (!firstCard) {
           return;
       }

       const cardWidth =
           firstCard.offsetWidth;

       const gap =
           parseInt(
               getComputedStyle(newsCardsContainer).gap
           ) || 0;

       const scrollAmount =
           (cardWidth + gap) * direction;

       newsCardsContainer.scrollBy({
           left: scrollAmount,
           behavior: "smooth"
       });

   }


   if (newsSliderPrev) {

       newsSliderPrev.addEventListener("click", () => {
           scrollNews(1);
       });

   }


   if (newsSliderNext) {

       newsSliderNext.addEventListener("click", () => {
           scrollNews(-1);
       });

   }
       /* =====================================================
       Auth / User Menu / Profile
       ===================================================== */

       const CURRENT_USER_KEY = "arvand_currentUser";
       const USERS_KEY = "arvand_users";
   
       const authButton =
           document.querySelector("#authButton");
   
       const userMenu =
           document.querySelector("#userMenu");
   
       const userButton =
           document.querySelector("#userButton");
   
       const userButtonName =
           document.querySelector("#userButtonName");
   
       const userDropdown =
           document.querySelector("#userDropdown");
   
       const profileButton =
           document.querySelector("#profileButton");
   
       const editProfileButton =
           document.querySelector("#editProfileButton");
   
       const logoutButton =
           document.querySelector("#logoutButton");
   
       const profileModal =
           document.querySelector("#profileModal");
   
       const profileModalClose =
           document.querySelector(".profile-modal-close");
   
       const profileModalTitle =
           document.querySelector("#profileModalTitle");
   
       const profileView =
           document.querySelector("#profileView");
   
       const profileEditForm =
           document.querySelector("#profileEditForm");
   
       const profileMessage =
           document.querySelector("#profileMessage");
   
       const profileFullName =
           document.querySelector("#profileFullName");
   
       const profileUsername =
           document.querySelector("#profileUsername");
   
       const profileRole =
           document.querySelector("#profileRole");
   
       const profileRegisteredAt =
           document.querySelector("#profileRegisteredAt");
   
       const profileLastLogin =
           document.querySelector("#profileLastLogin");
   
       const profileLoginCount =
           document.querySelector("#profileLoginCount");
   
       const editFullName =
           document.querySelector("#editFullName");
   
       const editRole =
           document.querySelector("#editRole");
   
       const editUsername =
           document.querySelector("#editUsername");
   
   
       /* ---------- خواندن اطلاعات ---------- */
   
       function getCurrentUser() {
   
           try {
   
               const raw =
                   localStorage.getItem(CURRENT_USER_KEY);
   
               if (!raw) {
                   return null;
               }
   
               return JSON.parse(raw);
   
           } catch (error) {
   
               return null;
   
           }
   
       }
   
   
       function getUsers() {
   
           try {
   
               const raw =
                   localStorage.getItem(USERS_KEY);
   
               if (!raw) {
                   return [];
               }
   
               const parsed =
                   JSON.parse(raw);
   
               return Array.isArray(parsed) ? parsed : [];
   
           } catch (error) {
   
               return [];
   
           }
   
       }
   
   
       function saveUsers(users) {
   
           try {
   
               localStorage.setItem(
                   USERS_KEY,
                   JSON.stringify(users)
               );
   
               return true;
   
           } catch (error) {
   
               return false;
   
           }
   
       }
   
   
       function getFullUserData(userId) {
   
           const users = getUsers();
   
           return users.find(user =>
               user.id === userId
           ) || null;
   
       }
   
   
       /* ---------- نمایش هدر ---------- */
   
       function renderAuthState() {
   
           const currentUser =
               getCurrentUser();
   
           if (currentUser) {
   
               if (authButton) {
                   authButton.hidden = true;
               }
   
               if (userMenu) {
                   userMenu.hidden = false;
               }
   
               if (userButtonName) {
                   userButtonName.textContent =
                       currentUser.fullName ||
                       currentUser.username ||
                       "کاربر";
               }
   
           } else {
   
               if (authButton) {
                   authButton.hidden = false;
               }
   
               if (userMenu) {
                   userMenu.hidden = true;
               }
   
               if (userDropdown) {
                   userDropdown.classList.remove("open");
               }
   
           }
   
       }
   
   
       /* ---------- منوی بازشو ---------- */
   
       function toggleUserDropdown(event) {
   
           if (event) {
               event.stopPropagation();
           }
   
           if (userDropdown) {
               userDropdown.classList.toggle("open");
           }
   
       }
   
   
       function closeUserDropdown() {
   
           if (userDropdown) {
               userDropdown.classList.remove("open");
           }
   
       }
   
   
       if (userButton) {
           userButton.addEventListener("click", toggleUserDropdown);
       }
   
   
       document.addEventListener("click", event => {
   
           if (!userDropdown || !userMenu) {
               return;
           }
   
           if (!userMenu.contains(event.target)) {
               closeUserDropdown();
           }
   
       });
   
   
       /* ---------- پر کردن مودال پروفایل ---------- */
   
       function fillProfileModal() {
   
           const currentUser =
               getCurrentUser();
   
           if (!currentUser) {
               return;
           }
   
           const fullData =
               getFullUserData(currentUser.id) ||
               currentUser;
   
           if (profileFullName) {
               profileFullName.textContent =
                   fullData.fullName || "—";
           }
   
           if (profileUsername) {
               profileUsername.textContent =
                   fullData.username || "—";
           }
   
           if (profileRole) {
               profileRole.textContent =
                   fullData.role || "—";
           }
   
           if (profileRegisteredAt) {
               profileRegisteredAt.textContent =
                   fullData.registeredAt || "—";
           }
   
           if (profileLastLogin) {
               profileLastLogin.textContent =
                   fullData.lastLogin || "—";
           }
   
           if (profileLoginCount) {
               profileLoginCount.textContent =
                   fullData.loginCount || 0;
           }
   
           if (editFullName) {
               editFullName.value =
                   fullData.fullName || "";
           }
   
           if (editRole) {
               editRole.value =
                   fullData.role || "";
           }
   
           if (editUsername) {
               editUsername.value =
                   fullData.username || "";
           }
   
       }
   
   
       /* ---------- باز کردن مودال ---------- */
   
       function openProfileModal(mode) {
   
           if (!profileModal) {
               return;
           }
   
           fillProfileModal();
   
           if (profileMessage) {
               profileMessage.className = "profile-message";
               profileMessage.textContent = "";
           }
   
           if (mode === "edit") {
   
               if (profileModalTitle) {
                   profileModalTitle.textContent = "ویرایش پروفایل";
               }
   
               if (profileView) {
                   profileView.hidden = true;
               }
   
               if (profileEditForm) {
                   profileEditForm.hidden = false;
               }
   
           } else {
   
               if (profileModalTitle) {
                   profileModalTitle.textContent = "پروفایل";
               }
   
               if (profileView) {
                   profileView.hidden = false;
               }
   
               if (profileEditForm) {
                   profileEditForm.hidden = true;
               }
   
           }
   
           openModal(profileModal);
   
       }
   
   
       if (profileButton) {
           profileButton.addEventListener("click", () => {
               closeUserDropdown();
               openProfileModal("view");
           });
       }
   
   
       if (editProfileButton) {
           editProfileButton.addEventListener("click", () => {
               closeUserDropdown();
               openProfileModal("edit");
           });
       }
   
   
       if (profileModalClose) {
           profileModalClose.addEventListener(
               "click",
               () => closeModal(profileModal)
           );
       }
   
   
       setupModalClose(profileModal, null);
   
   
       /* ---------- ذخیره تغییرات پروفایل ---------- */
   
       if (profileEditForm) {
   
           profileEditForm.addEventListener("submit", event => {
   
               event.preventDefault();
   
               const currentUser =
                   getCurrentUser();
   
               if (!currentUser) {
                   return;
               }
   
               const newFullName =
                   editFullName.value.trim();
   
               const newRole =
                   editRole.value.trim();
   
               if (!newFullName) {
   
                   if (profileMessage) {
                       profileMessage.className =
                           "profile-message error";
                       profileMessage.textContent =
                           "نام و نام خانوادگی را وارد کنید";
                   }
   
                   return;
   
               }
   
               const users =
                   getUsers();
   
               const index =
                   users.findIndex(user =>
                       user.id === currentUser.id
                   );
   
               if (index === -1) {
                   return;
               }
   
               users[index].fullName = newFullName;
               users[index].role = newRole || users[index].role;
   
               saveUsers(users);
   
               const updatedCurrentUser = {
                   ...currentUser,
                   fullName: newFullName,
                   role: users[index].role
               };
   
               try {
   
                   localStorage.setItem(
                       CURRENT_USER_KEY,
                       JSON.stringify(updatedCurrentUser)
                   );
   
               } catch (error) {
                   /* ذخیره نشد */
               }
   
               if (profileMessage) {
                   profileMessage.className =
                       "profile-message success";
                   profileMessage.textContent =
                       "تغییرات با موفقیت ذخیره شد";
               }
   
               fillProfileModal();
               renderAuthState();
   
               setTimeout(() => {
                   closeModal(profileModal);
               }, 900);
   
           });
   
       }
   
   
       /* ---------- خروج ---------- */
   
       if (logoutButton) {
   
           logoutButton.addEventListener("click", () => {
   
               try {
   
                   localStorage.removeItem(CURRENT_USER_KEY);
   
               } catch (error) {
                   /* حذف نشد */
               }
   
               window.location.href = "auth.html";
   
           });
   
       }
   
   
       /* ---------- بررسی اولیه ---------- */
   
       renderAuthState();
   
   
       /* ---------- به‌روزرسانی وضعیت ورود بعد از بازگشت ---------- */
   
       window.addEventListener("pageshow", () => {
           renderAuthState();
       });




    /* =====================================================
       Initial State
       ===================================================== */

    setActiveNavigation("home");

});
    /* =====================================================
       History Timeline
       ===================================================== */

       const timelineItems =
       document.querySelectorAll(".timeline-item");

   const historyContent =
       document.querySelector("#history-content");

   const historyContentYear =
       document.querySelector(".history-content-year");

   const historyContentTitle =
       document.querySelector(".history-content-text h3");

   const historyContentText =
       document.querySelector(".history-content-text p");


   function updateHistoryContent(item) {

       if (!item || !historyContent) {
           return;
       }

       const year = item.dataset.year || "";
       const title = item.dataset.title || "";
       const text = item.dataset.text || "";

       if (historyContentYear) {
           historyContentYear.textContent = year;
       }

       if (historyContentTitle) {
           historyContentTitle.textContent = title;
       }

       if (historyContentText) {
           historyContentText.textContent = text;
       }

   }


   timelineItems.forEach(item => {

       item.addEventListener("click", () => {

           timelineItems.forEach(other => {
               other.classList.remove("active");
           });

           item.classList.add("active");

           updateHistoryContent(item);

       });

   });
