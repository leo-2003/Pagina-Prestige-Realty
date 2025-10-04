import React, { useEffect } from 'react';

const SchedulePage: React.FC = () => {
    useEffect(() => {
        // This IIFE is from Cal.com and sets up the Cal object and script loading
        // It's safe to run on every mount because it checks if Cal is already initialized.
        (function (C: any, A: string, L: string) {
            let p = function (a: any, ar: any) { a.q.push(ar); };
            let d = C.document;
            C.Cal = C.Cal || function () {
                let cal = C.Cal;
                let ar = arguments;
                if (!cal.loaded) {
                    cal.ns = {};
                    cal.q = cal.q || [];
                    d.head.appendChild(d.createElement("script")).src = A;
                    cal.loaded = true;
                }
                if (ar[0] === L) {
                    const api = function () { p(api, arguments); };
                    const namespace = ar[1];
                    api.q = api.q || [];
                    if (typeof namespace === "string") {
                        cal.ns[namespace] = cal.ns[namespace] || api;
                        p(cal.ns[namespace], ar);
                        p(cal, ["initNamespace", namespace]);
                    } else p(cal, ar);
                    return;
                }
                p(cal, ar);
            };
        })(window, "https://app.cal.com/embed/embed.js", "init");

        // These are the specific initialization calls for the embed
        (window as any).Cal("init", "agenda-de-reunion", { origin: "https://app.cal.com" });

        (window as any).Cal.ns["agenda-de-reunion"]("inline", {
            elementOrSelector: "#my-cal-inline-agenda-de-reunion",
            config: { "layout": "month_view" },
            calLink: "ceo-ggs-leonel/agenda-de-reunion",
        });

        (window as any).Cal.ns["agenda-de-reunion"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });

        return () => {
            const calDiv = document.getElementById('my-cal-inline-agenda-de-reunion');
            if (calDiv) {
                // Cal.com renders an iframe inside this div. Remove it on unmount to clean up.
                while (calDiv.firstChild) {
                    calDiv.removeChild(calDiv.firstChild);
                }
            }
        }
    }, []);

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">Agendar una Reunión</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Elija una fecha y hora que le convengan para programar una reunión con nuestro equipo.
                    </p>
                </div>
                {/* Cal.com embed container */}
                <div className="rounded-lg shadow-xl overflow-hidden">
                    <div id="my-cal-inline-agenda-de-reunion" style={{ width: '100%', minHeight: '700px', overflow: 'scroll' }}></div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
