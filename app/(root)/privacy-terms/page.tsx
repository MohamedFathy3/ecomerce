import { ServerTranslate } from '@/components/ServerTranslate';

const PrivacyTermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="wrapper max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-700 bg-clip-text text-transparent mb-4">
            <ServerTranslate textKey="privacy.title" />
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-red-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-16">
          
          {/* Privacy Policy Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-12 bg-amber-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-amber-700">
                <ServerTranslate textKey="privacy.sections.privacy.title" />
              </h2>
            </div>

            <div className="space-y-8">
              
              {/* Introduction */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.introduction.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.introduction.content" />
                </p>
              </div>

              {/* Data Collection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.dataCollection.title" />
                </h3>
                <p className="text-gray-700 mb-3">
                  <ServerTranslate textKey="privacy.sections.privacy.dataCollection.content" />
                </p>
                <ul className="space-y-2 ml-6">
                  {[0, 1, 2, 3].map((index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        <ServerTranslate 
                          textKey={`privacy.sections.privacy.dataCollection.items.${index}`} 
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Usage */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.dataUsage.title" />
                </h3>
                <p className="text-gray-700 mb-3">
                  <ServerTranslate textKey="privacy.sections.privacy.dataUsage.content" />
                </p>
                <ul className="space-y-2 ml-6">
                  {[0, 1, 2, 3].map((index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        <ServerTranslate 
                          textKey={`privacy.sections.privacy.dataUsage.items.${index}`} 
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Retention */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.dataRetention.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.dataRetention.content" />
                </p>
              </div>

              {/* Data Sharing */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.dataSharing.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.dataSharing.content" />
                </p>
              </div>

              {/* Your Rights */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.yourRights.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.yourRights.content" />
                </p>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.security.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.security.content" />
                </p>
              </div>

              {/* Cookies */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.cookies.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.cookies.content" />
                </p>
              </div>

              {/* Children */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.children.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.children.content" />
                </p>
              </div>

              {/* Updates */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.privacy.updates.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.privacy.updates.content" />
                </p>
              </div>

            </div>
          </section>

          {/* Terms of Sale Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-12 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-red-700">
                <ServerTranslate textKey="privacy.sections.terms.title" />
              </h2>
            </div>

            <div className="space-y-8">
              
              {/* General */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.terms.general.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.terms.general.content" />
                </p>
              </div>

              {/* Shipping */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.terms.shipping.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.terms.shipping.content" />
                </p>
              </div>

              {/* Returns & Refunds */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.terms.returns.title" />
                </h3>
                <p className="text-gray-700 mb-3">
                  <ServerTranslate textKey="privacy.sections.terms.returns.content" />
                </p>
                <ul className="space-y-2 ml-6 mb-4">
                  {[0, 1].map((index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        <ServerTranslate 
                          textKey={`privacy.sections.terms.returns.items.${index}`} 
                        />
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 text-sm italic">
                  <ServerTranslate textKey="privacy.sections.terms.returns.note" />
                </p>
              </div>

              {/* Payments */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.terms.payments.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.terms.payments.content" />
                </p>
              </div>

              {/* Liability */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.terms.liability.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.terms.liability.content" />
                </p>
              </div>

              {/* Jurisdiction */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.terms.jurisdiction.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <ServerTranslate textKey="privacy.sections.terms.jurisdiction.content" />
                </p>
              </div>

              {/* Contact */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-amber-50 to-red-50 rounded-lg border border-amber-200">
                <h3 className="text-xl font-semibold text-amber-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <ServerTranslate textKey="privacy.sections.terms.contact.title" />
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  <ServerTranslate textKey="privacy.sections.terms.contact.content" />
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl text-white">
          <p className="text-lg font-semibold">
            <ServerTranslate textKey="privacy.sections.privacy.updates.content" />
          </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyTermsPage;