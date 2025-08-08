package com.genesys.messenger

import android.view.View.GONE
import android.view.View
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.ProgressBar
import androidx.fragment.app.Fragment
import com.facebook.react.ReactActivity
import com.genesys.cloud.core.utils.NRError
import com.genesys.cloud.integration.core.AccountInfo
import com.genesys.cloud.integration.core.StateEvent
import com.genesys.cloud.integration.messenger.MessengerAccount
import com.genesys.cloud.ui.structure.controller.ChatController
import com.genesys.cloud.ui.structure.controller.ChatEventListener
import com.genesys.cloud.ui.structure.controller.ChatLoadResponse
import com.genesys.cloud.ui.structure.controller.ChatLoadedListener
import com.awesomeproject.R  // <-- important
import org.json.JSONObject

class MobileMessengerActivity : ReactActivity() {    
 
private lateinit var chatController: ChatController
private lateinit var account: AccountInfo   
 
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.linear_layout)
    initAccount()
    createChat()
  }
 

private fun initAccount() {
    account = MessengerAccount(
        deploymentId = intent.getStringExtra(DeploymentId, ""),
        domain = intent.getStringExtra(Domain, "")
    ).apply {
        logging = intent.getBooleanExtra(Logging, false)

        val customDataString = intent.getStringExtra("CustomData") ?: ""
        if (customDataString.isNotEmpty()) {
            try {
                val customDataJson = JSONObject(customDataString)
                val attributes = mutableMapOf<String, String>()
                val keysIterator = customDataJson.keys()
                while (keysIterator.hasNext()) {
                    val key = keysIterator.next()
                    val value = customDataJson.getString(key)
                    attributes[key] = value
                }
                this.customAttributes = attributes  // Assign here
                Log.d(GenTag, "Custom attributes assigned: $attributes")
            } catch (e: Exception) {
                Log.e(GenTag, "Failed to parse custom data JSON: $e")
            }
        }
    }
}


  private fun createChat() {
 
    chatController = ChatController.Builder(this).build(account, object : ChatLoadedListener {
 
    override fun onComplete(result: ChatLoadResponse) {
     Log.d(GenTag, "Chat load completed: $result")
val chatFragment = result.fragment
            if (chatFragment != null) {
                supportFragmentManager.beginTransaction()
                    .replace(R.id.chat_container, chatFragment, CONVERSATION_FRAGMENT_TAG)
                    .commit()
            } else {
                Log.e(GenTag, "Chat fragment is null!")
                result.error?.let {
                    Log.e(GenTag, "Chat load error: ${it.errorCode} - ${it.description}")
                }
            }

 
        val progressBar = findViewById<ProgressBar>(R.id.waiting)
        progressBar.visibility = View.GONE
      }
    })
  }        

  companion object {
    const val CONVERSATION_FRAGMENT_TAG = "conversation_fragment"
    const val GenTag = "MobileMessengerActivity"
    const val DeploymentId = "deploymentId"
    const val Domain = "domain"
    const val Logging = "logging"
 
    fun intentFactory(deploymentId: String, domain: String, logging: Boolean, customData: String): Intent {
 
      return Intent("com.intent.action.Messenger_CHAT").apply {
        putExtra(DeploymentId, deploymentId)
        putExtra(Domain, domain)
        putExtra(Logging, logging)
        putExtra("CustomData", customData) // Add this
      }
    }

    // fun intentFactory(deploymentId: String, domain: String, logging: Boolean): Intent {
    // return Intent(reactContext, MobileMessengerActivity::class.java).apply {
    //     putExtra(DeploymentId, deploymentId)
    //     putExtra(Domain, domain)
    //     putExtra(Logging, logging)
    // }

 
    private fun Intent.getStringExtra(key: String, fallback: String?): String {
      return getStringExtra(key) ?: fallback ?: ""
    }
  }
}