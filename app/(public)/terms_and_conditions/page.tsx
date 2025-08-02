import React from "react";

export default function TermsAndCondition() {
    return (
        <div className="min-h-screen py-4 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-cyan-400 rounded-full mx-auto opacity-80"></div>
                </div>

                {/* Content Container */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-cyan-500 p-3">
                        <h2 className="text-lg font-semibold text-white text-center">
                            नियम और शर्तें | Terms & Conditions
                        </h2>
                    </div>

                    <div className="p-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                            {/* Hindi Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-cyan-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">
                                            हि
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        हिंदी में नियम
                                    </h3>
                                </div>

                                <ol className="space-y-2">
                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                महत्वपूर्ण
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            आदित्य प्रिंटिफाई इंडिया प्राइवेट
                                            लिमिटेड एक B2B कंपनी है, जहाँ
                                            प्रिंटिंग प्रेस अपने लिए गए ऑर्डर्स,
                                            को प्रोसेस होने के लिए भेजती है, यह
                                            ऑर्डर्स नकली / डुबलीकेट या
                                            प्रतिबंधित वस्तु, अथवा संस्था की
                                            अनुमति के बिना नहीं होने चाहिए ! यह
                                            सुनिश्चित करना डिस्ट्रीब्यूटर /
                                            प्रिंटिंग प्रेस की ही जिम्मेदारी
                                            होगी। अगर कोई प्रिंटिंग प्रेस या
                                            डिस्ट्रीब्यूटर जानबुझ कर नकली /
                                            डुबलीकेट या प्रतिबंधित वस्तु के
                                            आर्डर प्रोसेस होने हमें भेजती है, तो
                                            उनकी सदयस्ता आजीवन रद्द कर दी जाएगी।
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                महत्वपूर्ण
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            पहले से हो रखी कोई भी प्रिंटिंग के
                                            सामान कलर नहीं आएगा (चाहे वह हमसे या
                                            अन्य कही से हो रखी हो, चाहे वह
                                            डिजिटल या ओफ़्सेट से हो रखी हो), अगर
                                            आप दुबारा प्रिंटिंग होने पर सामान
                                            कलर चाहते है तो जॉब के प्रोफाइल सेव
                                            करवाए, जॉब की प्रोफाइल सेव करने के
                                            अतरिक्त चार्जेज देय होगा ।
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                महत्वपूर्ण
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            मैं स्वीकार करता हूं कि{" "}
                                            <strong className="text-primary">
                                                आदित्य प्रिंटिफाई इंडिया
                                                प्राइवेट लिमिटेड
                                            </strong>{" "}
                                            की जिम्मेदारी सामान को ट्रांसपोर्ट
                                            या कूरियर तक पहुंचाने की ही होगी !
                                            यदि ट्रांसपोर्टर या कूरियर कंपनी की
                                            वजह या किसी और वजह से सामान को
                                            नुकसान होता है तो हमारी कोइ
                                            जिम्मेदारी नहीं होगी !
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                महत्वपूर्ण
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            आदित्य प्रिंटिफाई इंडिया प्राइवेट
                                            लिमिटेड वाले सभी प्रोडक्ट्स (जैसे
                                            विजिटिंग कार्ड, एटीएम पाउच, लेटर
                                            हेड, एनवलप इत्यादि ) में अगर 5 से
                                            50% शीट्स/ कार्ड में अगर प्रिंटिंग
                                            मिस्टेक है तो उसी अनुपात में केवल
                                            डिस्काउंट ही किया जा सकता है. एवं
                                            अगर 50 % शीट्स से ज्यादा में
                                            प्रिंटिंग मिस्टेक है तो ही आर्डर को
                                            रीप्रिंट किया जायेगा ।
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                5
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            प्रिंटिंग मिस्टेक होने पर अगर आपके
                                            ऑर्डर को रीप्रिंट किया गया है तो
                                            रीप्रिंटेड ऑर्डर का ट्रांसपोर्टेशन
                                            चार्ज आपके द्वारा देय होगा ।
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                6
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            मैं मानता हूं कि उत्पाद के लेन देन
                                            में किसी भी विवाद / खोने / देरी से
                                            प्राप्त होने इत्यादि की स्थिति में,
                                            &quot;
                                            <strong className="text-primary">
                                                आदित्य प्रिंटिफाई इंडिया
                                                प्राइवेट लिमिटेड
                                            </strong>
                                            &quot; की अधिकतम देनदारी केवल
                                            विवादित उत्पाद के दर तक ही होगी !
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                7
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            आदित्य प्रिंटिफाई इंडिया प्राइवेट
                                            लिमिटेड के पास किसी की भी
                                            &quot;membership&quot; को रद्द करने
                                            एवं चैनल पार्टनर कोड को बदलने के सभी
                                            अधिकार हैं !
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                8
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            केवल आदित्य प्रिंटिफाई इंडिया
                                            प्राइवेट लिमिटेड के बैंक खाते में
                                            किये गए पेमेंट के लिए ही कंपनी
                                            जिम्मेदार होगी
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                9
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            मैं, मुझे और मेरे ग्राहकों को
                                            सेवा/लेन-देन संबंधी एसएमएस भेजने के
                                            लिए &quot;आदित्य प्रिंटिफाई इंडिया
                                            प्राइवेट लिमिटेड&quot; को
                                            &quot;अनापत्ति&quot; प्रदान करता हूं
                                            ।
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-cyan-500 pl-3 bg-gradient-to-r from-cyan-100 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-cyan-500 to-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                10
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed font-medium">
                                            सभी कानूनी मामले केवल दिल्ली
                                            न्यायालय के अधीन हैं !
                                        </p>
                                    </li>
                                </ol>
                            </div>

                            {/* English Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-cyan-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">
                                            EN
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        English Terms
                                    </h3>
                                </div>

                                <ol className="space-y-2">
                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                IMPORTANT
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            ADITYA PRINTIFY INDIA PVT LTD is a
                                            B2B Company, which prints orders
                                            from Printing Press only, and these
                                            orders shall not contain Duplicate /
                                            Fake, Prohibited Content or without
                                            the permission or related
                                            organisation, will be sole
                                            responsibility of Pringing Press /
                                            Channel Partner only. And if any
                                            Printing Agency Knowingly or
                                            unknowingly orders duplicate / Fake
                                            or prohibited content then its
                                            membership will be discoutinued for
                                            lifetime.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                IMPORTANT
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Same color will never match with any
                                            printing previously done (whether it
                                            is from us or from elsewhere,
                                            whether it is digital or offset), if
                                            you want the same color printing in
                                            future, then get job profile saved
                                            with us, extra charges will be
                                            payable against job profiling.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                IMPORTANT
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            I accept the ADITYA PRINTIFY INDIA
                                            PVT LTD&apos;s responsibility ceases
                                            the moment the goods leave
                                            company&apos;s godown.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-red-500 pl-3 bg-red-50 p-2 rounded-r-md">
                                        <div className="flex items-start gap-1 mb-1">
                                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                                IMPORTANT
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            In all products with ADITYA PRINTIFY
                                            INDIA PVT LTD (like visiting cards,
                                            ATM pouches, letter heads, envelopes
                                            etc.), if there is a printing
                                            mistake in 5 to 50% of the sheets /
                                            cards, then only the same proportion
                                            can be discounted. And if there is a
                                            printing mistake in more than 50% of
                                            the sheets only then the order will
                                            be reprinted.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                5
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            If your order has been reprinted
                                            because of printing mistake, the
                                            transportation charges will be paid
                                            by you.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                6
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            I agree that in case of any dispute
                                            / lost / delayed receipt etc. in the
                                            transaction of the product, the
                                            maximum liability of &quot;ADITYA
                                            PRINTIFY INDIA PVT LTD&quot; will be
                                            only up to the rate of the disputed
                                            product.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                7
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            ADITYA PRINTIFY INDIA PVT LTD has
                                            all rights to cancel / change any
                                            membership / channel partner code
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                8
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            The company will be responsible only
                                            for the payment made in the bank
                                            account of ADITYA PRINTIFY INDIA PVT
                                            LTD.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-primary pl-3 bg-gradient-to-r from-primary/10 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-primary to-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                9
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            I hereby provide &quot;No
                                            Objection&quot; to &quot;ADITYA
                                            PRINTIFY INDIA PVT LTD&quot; for
                                            sending service/transactional
                                            related sms to me and my customers
                                            too.
                                        </p>
                                    </li>

                                    <li className="border-l-3 border-cyan-500 pl-3 bg-gradient-to-r from-cyan-100 to-cyan-50 p-2 rounded-r-md">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="bg-gradient-to-r from-cyan-500 to-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                                                10
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed font-medium">
                                            All the leagal matters are subject
                                            to Delhi Jurisdiction Only
                                        </p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {/* <div className="text-center mt-6 text-gray-600">
                    <p className="text-xs">
                        © 2025 Aditya Printify Pvt Limited. All rights
                        reserved.
                    </p>
                    <p className="text-xs mt-1">Last updated: July 2025</p>
                </div> */}
            </div>
        </div>
    );
}
