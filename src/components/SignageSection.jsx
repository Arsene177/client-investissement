import React from 'react';

const SignageSection = () => {
    return (
        <section className="signage-section">
            <div className="container">
                <div className="signage-image-wrapper">
                    <img
                        src="/assets/signage.jpg"
                        alt="FUTUR GROUP INVEST Office"
                        className="signage-image"
                    />
                </div>
            </div>

            <style>{`
        .signage-section {
          padding: 4rem 0;
          background: var(--bg);
        }

        .signage-image-wrapper {
          max-width: 900px;
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .signage-image-wrapper:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
        }

        .signage-image {
          width: 100%;
          height: auto;
          display: block;
        }

        @media (max-width: 768px) {
          .signage-section {
            padding: 2rem 0;
          }

          .signage-image-wrapper {
            border-radius: 12px;
          }
        }
      `}</style>
        </section>
    );
};

export default SignageSection;
