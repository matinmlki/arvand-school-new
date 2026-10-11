/* =========================================================
   Arvand School 1
   Auth Page JavaScript
   ========================================================= */


   document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM Elements
       ===================================================== */

    const panels =
        document.querySelectorAll(".auth-panel");

    const loginForm =
        document.querySelector("#loginForm");

    const registerForm =
        document.querySelector("#registerForm");

    const loginMessage =
        document.querySelector("#loginMessage");

    const registerMessage =
        document.querySelector("#registerMessage");


    /* =====================================================
       Constants
       ===================================================== */

    const USERS_KEY = "arvand_users";
    const CURRENT_USER_KEY = "arvand_currentUser";


    /* =====================================================
       Utilities
       ===================================================== */

    function encodePassword(password) {
        try {
            return btoa(unescape(encodeURIComponent(password)));
        } catch (error) {
            return password;
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


    function getTodayShamsi() {

        try {

            return new Date().toLocaleDateString("fa-IR");

        } catch (error) {

            return "";

        }

    }


    function showMessage(element, type, text) {

        if (!element) {
            return;
        }

        element.className =
            "auth-message " + (type || "");

        element.textContent = text || "";

    }


    function clearMessage(element) {

        if (!element) {
            return;
        }

        element.className = "auth-message";
        element.textContent = "";

    }


    function validateUsername(username) {

        if (!username) {
            return "نام کاربری را وارد کنید";
        }

        if (username.length < 4) {
            return "نام کاربری باید حداقل ۴ کاراکتر باشد";
        }

        if (!/^[A-Za-z0-9_]+$/.test(username)) {
            return "نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد و آندرلاین باشد";
        }

        return "";

    }


    function validatePassword(password) {

        if (!password) {
            return "رمز عبور را وارد کنید";
        }

        if (password.length < 6) {
            return "رمز عبور باید حداقل ۶ کاراکتر باشد";
        }

        return "";

    }


    function checkUsernameExists(username) {

        const users = getUsers();

        return users.some(user =>
            user.username &&
            user.username.toLowerCase() === username.toLowerCase()
        );

    }


    /* =====================================================
       Tab Switch
       ===================================================== */

    function switchPanel(panelName) {

        panels.forEach(panel => {

            const isTarget =
                panel.dataset.panel === panelName;

            panel.classList.toggle("active", isTarget);

        });

        clearMessage(loginMessage);
        clearMessage(registerMessage);

        const activeInput =
            document.querySelector(
                ".auth-panel.active input"
            );

        if (activeInput) {
            activeInput.focus();
        }

    }


    panels.forEach(panel => {

        panel.addEventListener("click", event => {

            if (panel.classList.contains("active")) {
                return;
            }

            if (event.target.closest(".auth-form")) {
                return;
            }

            switchPanel(panel.dataset.panel);

        });

    });


    /* =====================================================
       Register
       ===================================================== */

    function registerUser(data) {

        const users = getUsers();

        const newUser = {
            id: Date.now(),
            fullName: data.fullName,
            role: data.role || "کاربر",
            username: data.username,
            password: encodePassword(data.password),
            registeredAt: getTodayShamsi(),
            lastLogin: "",
            loginCount: 0
        };

        users.push(newUser);

        const saved = saveUsers(users);

        if (!saved) {
            return {
                ok: false,
                message: "خطا در ذخیره‌سازی اطلاعات. لطفاً دوباره تلاش کنید"
            };
        }

        return {
            ok: true,
            message: "ثبت‌نام با موفقیت انجام شد. حالا می‌توانید وارد شوید"
        };

    }


    if (registerForm) {

        registerForm.addEventListener("submit", event => {

            event.preventDefault();

            clearMessage(registerMessage);

            const fullName =
                registerForm.fullName.value.trim();

            const role =
                registerForm.role.value.trim();

            const username =
                registerForm.username.value.trim();

            const password =
                registerForm.password.value;


            if (!fullName) {
                showMessage(
                    registerMessage,
                    "error",
                    "نام و نام خانوادگی را وارد کنید"
                );
                return;
            }


            const usernameError =
                validateUsername(username);

            if (usernameError) {
                showMessage(
                    registerMessage,
                    "error",
                    usernameError
                );
                return;
            }


            const passwordError =
                validatePassword(password);

            if (passwordError) {
                showMessage(
                    registerMessage,
                    "error",
                    passwordError
                );
                return;
            }


            if (checkUsernameExists(username)) {
                showMessage(
                    registerMessage,
                    "error",
                    "این نام کاربری قبلاً استفاده شده است"
                );
                return;
            }


            const result =
                registerUser({
                    fullName,
                    role,
                    username,
                    password
                });


            if (result.ok) {

                showMessage(
                    registerMessage,
                    "success",
                    result.message
                );

                registerForm.reset();

                setTimeout(() => {
                    switchPanel("login");
                }, 1200);

            } else {

                showMessage(
                    registerMessage,
                    "error",
                    result.message
                );

            }

        });

    }


    /* =====================================================
       Login
       ===================================================== */

    function findUser(username, password) {

        const users = getUsers();

        const encodedPassword =
            encodePassword(password);

        return users.find(user =>
            user.username &&
            user.username.toLowerCase() === username.toLowerCase() &&
            user.password === encodedPassword
        );

    }


    function updateLoginStats(user) {

        const users = getUsers();

        const index =
            users.findIndex(u => u.id === user.id);

        if (index === -1) {
            return;
        }

        users[index].lastLogin =
            getTodayShamsi();

        users[index].loginCount =
            (users[index].loginCount || 0) + 1;

        saveUsers(users);

    }


    function setCurrentUser(user) {

        try {

            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify({
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role
                })
            );

        } catch (error) {
            /* ذخیره نشد */
        }

    }


    if (loginForm) {

        loginForm.addEventListener("submit", event => {

            event.preventDefault();

            clearMessage(loginMessage);

            const username =
                loginForm.username.value.trim();

            const password =
                loginForm.password.value;


            if (!username || !password) {
                showMessage(
                    loginMessage,
                    "error",
                    "نام کاربری و رمز عبور را وارد کنید"
                );
                return;
            }


            const user =
                findUser(username, password);


            if (!user) {
                showMessage(
                    loginMessage,
                    "error",
                    "نام کاربری یا رمز عبور اشتباه است"
                );
                return;
            }


            updateLoginStats(user);
            setCurrentUser(user);

            showMessage(
                loginMessage,
                "success",
                "خوش آمدید " + user.fullName
            );

            setTimeout(() => {
                window.location.href = "index.html";
            }, 900);

        });

    }


    /* =====================================================
       Initial State
       ===================================================== */

    switchPanel("login");

});