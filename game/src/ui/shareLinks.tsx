import { Fragment, h } from "preact";
// @ts-ignore
import MastoLogo from "../img/mastodon.svg";
// @ts-ignore
import ShareIcon from "../img/share.svg";
// @ts-ignore
import TelegramLogo from "../img/telegram.svg";
// @ts-ignore
import TwitterLogo from "../img/twitter.svg";
export function ShareLinks({text}: {text: string}) {
    function doMastoShare() {
        let instance = prompt("Enter your Mastodon instance (e.g. mastodon.social)", localStorage.getItem('mastodon-instance') || 'mastodon.social');
        if (instance) {
            localStorage.setItem('mastodon-instance', instance);
            let url = `https://${instance}/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.href)}`;
            window.open(url, '_blank');
        }
    }

    function doNativeShare() {
        navigator.share({title: document.title, text, url: location.href});
    }
    return <div class='slinks'>
        <a class='s-link twt button' href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.href)}`} target='_blank' rel='noopener noreferrer'>
            <img src={TwitterLogo} alt='Twitter Logo' height={32} />
        </a>
        <a class='s-link msto button' onClick={doMastoShare} target='_blank' rel='noopener noreferrer'>
            <img src={MastoLogo} alt='Mastodon Logo' height={32} />
        </a>
        <a class='s-link tg button' href={`https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(text)}`} target='_blank' rel='noopener noreferrer'>
            <img src={TelegramLogo} alt='Telegram Logo' height={32} />
        </a>
        {"share" in navigator && <button class='s-link native button' onClick={doNativeShare}>
            <img src={ShareIcon} alt='Share' height={32} />
        </button>}
    </div>
}