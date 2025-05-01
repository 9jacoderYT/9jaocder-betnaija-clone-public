"use client";
import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
  const bet9jaLinks = [
    { label: "Home", href: "#/", id: "footer_link_home" },
    {
      label: "About us",
      href: "https://help.bet9ja.com/about-us/",
      id: "footer_link_about_us",
    },
    {
      label: "Become an Agent",
      href: "https://agents.bet9ja.com/",
      id: "footer_link_become_agent",
    },
    {
      label: "Contact us",
      href: "https://account.bet9ja.com/messaging-fe/ContactUs/?s=new",
      id: "footer_link_contact",
    },
    {
      label: "Results",
      href: "https://ls.sir.sportradar.com/bet9ja",
      id: "footer_link_results",
    },
    {
      label: "Web Affiliates",
      href: "https://affiliates.bet9ja.com/",
      id: "footer_link_web_affiliates",
    },
  ];

  const policyLinks = [
    {
      label: "Terms & Conditions",
      href: "https://help.bet9ja.com/general-tcs/",
      id: "footer_link_t_and_c",
    },
    {
      label: "Responsible Gambling",
      href: "https://help.bet9ja.com/responsible-gaming/",
      id: "footer_link_responsible_gambling",
    },
    {
      label: "Privacy",
      href: "https://help.bet9ja.com/privacy/",
      id: "footer_link_privacy",
    },
  ];

  const socialLinks = [
    {
      platform: "facebook",
      id: "footer_link_facebook",
      title: "Facebook",
      icon: <Facebook />,
    },
    {
      platform: "twitter",
      id: "footer_link_twitter",
      title: "Twitter",
      icon: <Twitter />,
    },
    {
      platform: "instagram",
      id: "footer_link_instagram",
      title: "Instagram",
      icon: <Instagram />,
    },
  ];

  return (
    <footer className="footer bg-[#37444e] text-white font-roboto text-xs relative">
      <div className="container mx-auto">
        <div>
          <div>
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between pb-6 border-b border-gray-600 border-t-4 border-t-green-500 p-5">
              <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
                {/* Bet9ja Links */}
                <div className="">
                  <h3 className="text-sm font-bold mb-2">Bet9ja</h3>
                  <div className="space-y-2">
                    {bet9jaLinks.map((link) => (
                      <div key={link.id} className="">
                        <a
                          href={link.href}
                          id={link.id}
                          title={link.label}
                          className="f-ml-link hover:text-blue-400 text-green-300"
                        >
                          {link.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy Links */}
                <div className="f-ml__nav">
                  <div className="f-ml__nav-list space-y-2">
                    {policyLinks.map((link) => (
                      <div key={link.id} className="text-green-300">
                        <a
                          href={link.href}
                          id={link.id}
                          title={link.label}
                          className="f-ml-link hover:text-blue-400"
                        >
                          {link.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="f-ml__social flex space-x-4 mt-6 md:mt-0">
                {socialLinks.map((social) => (
                  <div key={social.id} id={social.id} title={social.title}>
                    <div className="bg-gray-500 rounded-full p-2 ">
                      {social.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Right Section */}
              <div
                className="mt-6 md:mt-0 w-full md:w-[230px] h-48 bg-[#414954] bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url(https://cnt.bet9ja.com/cdn/wall-e/components/footer/img/bet9ja/desktop/footer-region-bg-02.png)",
                }}
              />
            </div>

            {/* Bottom Section */}
            <div className="f-ml__bottom p-2 flex flex-col md:flex-row justify-between">
              <div className="f-ml__info flex flex-col md:flex-row justify-between w-full">
                <div className="f-ml__info-left mb-4 md:mb-0">
                  <div>
                    <div className="w-32 h-8 bg-gray-500 cursor-pointer" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-gray-400">
                    © Bet9ja All rights reserved
                    <span className="ml-2 w-4 h-4 bg-gray-500 rounded-full inline-block" />
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Section */}
            <div className="p-2">
              <div className="">
                <p className="text-[10px] text-gray-400">
                  Sports/Casino Betting license numbers: 0001074/00000014
                  <br />
                  Bet9ja is not affiliated or connected with sports teams, event
                  organisers and/or players displayed on its images/websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
