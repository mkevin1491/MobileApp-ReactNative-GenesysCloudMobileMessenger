package com.genesys.messenger

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONObject

class MobileMessengerSdkModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun startChat(deploymentId: String, domain: String, logging: Boolean, customData: String) {
    val jsonObject = JSONObject(customData)
    val department = jsonObject.optString("department")
    val propertyType = jsonObject.optString("property_type")
    val device = jsonObject.optString("device")
    
    currentActivity?.run {
            startActivity(
                MobileMessengerActivity.intentFactory(deploymentId, domain, logging, customData)
            )
        }
    }

    companion object {
        const val NAME = "MobileMessengerSdk"
    }
}
