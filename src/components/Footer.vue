<script setup lang="ts">

</script>

<template>
    <footer class="footer">
        <div class="footer__container">
            <div class="footer__head">
                <div class="footer__logo">
                    <RouterLink
                        class="header__logo"
                        :to="{ name: 'home' }"
                    >
                        dance<span>moves</span>
                    </RouterLink>
                </div>
                <h2 class="footer__title">Сайт создан в целях обучения и&nbsp;прикола</h2>

            </div>


            <div class="column">
                <h4>Предложения об улучшении, похвалу и&nbsp;тапки кидать сюда:</h4>
                <a href="https://t.me/nasya_march">Написать мне в&nbsp;телеграм</a>

                <a href="mailto:nastya.marchenko00@gmail.com">Написать мне на&nbsp;почту</a>

            </div>

        </div>
    </footer>
</template>

<style lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.footer {
    width: 100%;
    padding: clamp-f(16, 32) clamp-f(16, 48) 32px clamp-f(16, 32);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    background-color: #222222;
    color: rgb(225, 225, 225);
    font-family: "Lato", sans-serif;

    &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp-f(32, 48);
        width: 100%;
        max-width: 1200px;
    }

    &__head {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    &__title {
        color: #e1e1e1;
        text-align: center;
    }

    &__logo {
        background-color: #fff;
        padding: 12px;
        border-radius: 12px;
        width: max-content;
        height: max-content;

        & .header__logo {
            font-size: 2rem;
            font-family: "Inter", sans-serif;
        }
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 0 clamp-f(24, 32);
        text-align: center;

        h4 {
            color: rgb(220, 200, 255);
            max-width: clamp-f(240, 470);
        }

        a {
            color: #e1e1e1;
            font-size: clamp-f(14px, 16px);
            @include hover {
                scale: 1.05;
            }
        }


    }
}

</style>